import { Injectable } from '@nestjs/common';
import { AssignmentRepository } from '../../database/repositories/Assignment.repository';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto/assignment.dto';

@Injectable()
export class AssignmentService {
  constructor(private assignmentRepository: AssignmentRepository) {}

  async create(createAssignmentDto: CreateAssignmentDto) {
    return await this.assignmentRepository.create(createAssignmentDto);
  }

  async findAll() {
    return await this.assignmentRepository.findAll();
  }

  async findOne(id: number) {
    return await this.assignmentRepository.findById(id);
  }

  async update(id: number, updateAssignmentDto: UpdateAssignmentDto) {
    return await this.assignmentRepository.update(id, updateAssignmentDto);
  }

  async remove(id: number) {
    return await this.assignmentRepository.delete(id);
  }
}

