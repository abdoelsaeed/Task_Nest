/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, Query, ParseUUIDPipe } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobStatus } from './enums/job-status.enum';
/**
 * JobsController exposes REST API endpoints
 * for managing scheduled jobs.
*/
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createJob(@Body() createJobDto: CreateJobDto) {
    const job = await this.jobsService.create(createJobDto);
    return {
      status: 201,
      message: 'Job created successfully 🎉',
      data: job,
    };
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: JobStatus,
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const { data, total } = await this.jobsService.findAll(
      pageNumber,
      limitNumber,
      status,
    );

    return {
      message: 'Jobs retrieved successfully',
      data,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
      },
    };
  }
  @Get(':id')
  async findById(@Param('id', new ParseUUIDPipe()) id: string) {
    const job = await this.jobsService.findOne(id);
    return {
      message: 'Job retrieved successfully',
      data: job,
    };
  }
}
