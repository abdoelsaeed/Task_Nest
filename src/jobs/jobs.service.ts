/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { Repository } from 'typeorm';
import { JobEntity } from './entities/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JobStatus } from './enums/job-status.enum';
/**
 * JobsService handles job persistence and business logic.
 * It is responsible for creating jobs and retrieving them from the database.
 */
@Injectable()
export class JobsService {
  constructor(@InjectRepository(JobEntity) private readonly jobRepository:Repository<JobEntity>){}
  /**
   * Creates a new scheduled job.
   *
   * - Calculates the next execution time based on the provided interval.
   * - Initializes job status as ACTIVE.
   *
   * @param createJobDto Job creation payload
   * @returns The persisted Job entity
  */
  create(createJobDto: CreateJobDto): Promise<JobEntity> {
    const { name, intervalInSeconds, payload } = createJobDto;
    const now = new Date();
    const CalcNextRunAt = (now.getTime() + intervalInSeconds * 1000);
    const job = this.jobRepository.create({
      name,
      intervalInSeconds,
      payload,
      status:JobStatus.ACTIVE,
      lastRunAt:null,
      nextRunAt: new Date(CalcNextRunAt)
    })
    return this.jobRepository.save(job);
  }

  /**
   * Retrieves a paginated and optionally filtered list of jobs.
   *
   * @param page Page number (starts from 1)
   * @param limit Number of items per page
   * @param status Optional job status filter
   * @returns Paginated jobs data with total count
   */
  async findAll(
    page = 1,
    limit = 10,
    status?: JobStatus,
  ): Promise<{ data: JobEntity[]; total: number }> {
    // Safety guards (important for scalability)
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 50); 
    let where: Record<string, any> = {};

    if (
      status === JobStatus.ACTIVE ||
      status === JobStatus.PAUSED
    ) {
      where = { status };
    }

    const [data, total] = await this.jobRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    });

    return {
      data,
      total,
    };
  }

  /**
   * Retrieves a single job by its ID.
   *
   * @param id Job UUID
   * @throws NotFoundException if the job does not exist
   * @returns Job entity
   */
  async findOne(id: string): Promise<JobEntity> {
    const job = await this.jobRepository.findOne({
      where: { id },
    });
    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }
    return job;
  }


}
