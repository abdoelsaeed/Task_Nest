/* eslint-disable prettier/prettier */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import { JobStatus } from '../enums/job-status.enum';

@Entity('jobs')
@Index(['nextRunAt', 'status'])
export class JobEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'jsonb', nullable: true })
    payload?: Record<string, any>;

    @Column({ type: 'int' })
    intervalInSeconds: number;

    @Column({ type: 'timestamptz', nullable: true })
    lastRunAt: Date | null;

    @Column({ type: 'timestamptz' })
    nextRunAt: Date;

    @Column({
        type: 'enum',
        enum: JobStatus,
        default: JobStatus.ACTIVE,
    })
    status: JobStatus;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
