/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JobsScheduler } from '../src/jobs/jobs.scheduler';
import { Repository } from 'typeorm';
import { JobEntity } from '../src/jobs/entities/job.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Jobs E2E', () => {
  let app: INestApplication;
  let scheduler: JobsScheduler;
  let jobRepository: Repository<JobEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();

    scheduler = moduleFixture.get(JobsScheduler);
    jobRepository = moduleFixture.get<Repository<JobEntity>>(
      getRepositoryToken(JobEntity),
    );
  });

  beforeEach(async () => {
    await jobRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it(
    'should create a job and execute it via scheduler',
    async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/jobs')
        .send({
          name: 'e2e-clean-job',
          intervalInSeconds: 10,
          payload: {
            type: 'email',
            to: 'test@test.com',
          },
        })
        .expect(201);

      const jobId = createResponse.body.data.id;
      expect(jobId).toBeDefined();

      const job = await jobRepository.findOne({
        where: { id: jobId },
      });

      expect(job).toBeDefined();
      if (!job) {
        throw new Error('Job was not found in database');
      }

      job.nextRunAt = new Date(Date.now() - 1000);
      await jobRepository.save(job);


      await scheduler.runDueJobs();

      const getResponse = await request(app.getHttpServer())
        .get(`/api/v1/jobs/${jobId}`)
        .expect(200);

      expect(getResponse.body.data.lastRunAt).not.toBeNull();
    },
    15000, 
  );
});
