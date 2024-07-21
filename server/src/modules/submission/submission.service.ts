import { Injectable, NotFoundException } from '@nestjs/common';
import { StudentSubmissionRepository } from '../../database/repositories/StudentSubmission.repository';
import { CreateSubmissionDto, UpdateSubmissionDto } from './dto/submission.dto';

@Injectable()
export class SubmissionService {
  constructor(private studentSubmissionRepository: StudentSubmissionRepository) {}

  async create(createSubmissionDto: CreateSubmissionDto) {
    return await this.studentSubmissionRepository.create(createSubmissionDto);
  }

  async findOne(id: number) {
    const submission = await this.studentSubmissionRepository.findById(id);
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    return submission;
  }

  async update(id: number, updateSubmissionDto: UpdateSubmissionDto) {
    const submission = await this.studentSubmissionRepository.findById(id);
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    return await this.studentSubmissionRepository.update(id, updateSubmissionDto);
  }

  async findByAssignment(assignmentId: number) {
    return await this.studentSubmissionRepository.findByAssignmentId(assignmentId);
  }
}