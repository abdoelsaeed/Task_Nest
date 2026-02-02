/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './entities/job.entity';
import { JobsScheduler } from './jobs.scheduler';

@Module({
  imports:[TypeOrmModule.forFeature([JobEntity])],
  controllers: [JobsController],
  providers: [JobsService, JobsScheduler],
})
export class JobsModule {}
