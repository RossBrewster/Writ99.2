import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { StudentSubmission } from '../../database/entities/StudentSubmission.entity';
import { StudentSubmissionRepository } from '../../database/repositories/StudentSubmission.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StudentSubmission])],
  controllers: [SubmissionController],
  providers: [SubmissionService, StudentSubmissionRepository],
  exports: [SubmissionService],
})
export class SubmissionModule {}
