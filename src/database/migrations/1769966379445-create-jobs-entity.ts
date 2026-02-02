/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobsEntity1769966379445 implements MigrationInterface {
    name = 'CreateJobsEntity1769966379445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."jobs_status_enum" AS ENUM('ACTIVE', 'PAUSED')`);
        await queryRunner.query(`CREATE TABLE "jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "payload" jsonb, "intervalInSeconds" integer NOT NULL, "lastRunAt" TIMESTAMP WITH TIME ZONE, "nextRunAt" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."jobs_status_enum" NOT NULL DEFAULT 'ACTIVE', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a7563ceb8577812dcfce1bcd4e" ON "jobs" ("nextRunAt", "status") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a7563ceb8577812dcfce1bcd4e"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
        await queryRunner.query(`DROP TYPE "public"."jobs_status_enum"`);
    }

}
