/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { JobEntity } from './entities/job.entity';
import { JobStatus } from './enums/job-status.enum';

@Injectable()
export class JobsScheduler {
    private readonly logger = new Logger(JobsScheduler.name);

    constructor(
        @InjectRepository(JobEntity)
        private readonly jobRepository: Repository<JobEntity>,
    ) {
        // نشغّل الـ scheduler أول ما الـ provider يتعمل
        this.start();
    }

    /**
     * Starts the scheduler loop.
     */
    private start() {
        setInterval(() => {
            this.runDueJobs();
        }, 5000); // كل 5 ثواني
    }

    /**
     * Finds and executes due jobs.
     */
    private async runDueJobs(): Promise<void> {
        const now = new Date();

        // 1️⃣ نجيب الـ jobs اللي وقتها جه
        const dueJobs = await this.jobRepository.find({
            where: {
                status: JobStatus.ACTIVE,
                nextRunAt: LessThanOrEqual(now),
            },
        });

        // 2️⃣ نشغّل كل job
        for (const job of dueJobs) {
            await this.executeJob(job);
        }
    }

    /**
     * Executes a single job (dummy logic).
     */
    private async executeJob(job: JobEntity): Promise<void> {
        this.logger.log(`Running job: ${job.name}`);

        const now = new Date();

        // Dummy execution
        console.log(`Executing job "${job.name}" with payload:`, job.payload);

        // 3️⃣ نحدّث التوقيتات
        job.lastRunAt = now;
        job.nextRunAt = new Date(
            now.getTime() + job.intervalInSeconds * 1000,
        );

        await this.jobRepository.save(job);
    }
}
