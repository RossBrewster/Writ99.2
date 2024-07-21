import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from '../entities/Assignment.entity';
import { User } from '../entities/User.entity';
import { Classroom } from '../entities/Classroom.entity';

@Injectable()
export class AssignmentRepository {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
  ) {}

  async create(assignmentData: Partial<Assignment>): Promise<Assignment> {
    const assignment = this.assignmentRepository.create(assignmentData);
    return await this.assignmentRepository.save(assignment);
  }

  async findAll(): Promise<Assignment[]> {
    return await this.assignmentRepository.find();
  }

  async findById(id: number, relations: string[] = []): Promise<Assignment | undefined> {
    return await this.assignmentRepository.findOne({ where: { id }, relations });
  }

  async update(id: number, assignmentData: Partial<Assignment>): Promise<Assignment | undefined> {
    await this.assignmentRepository.update(id, assignmentData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.assignmentRepository.delete(id);
  }

  async findByClassroom(classroomId: number): Promise<Assignment[]> {
    return await this.assignmentRepository.find({
      where: { classroom: { id: classroomId } },
      relations: ['classroom'],
    });
  }

  async findByCreator(userId: number): Promise<Assignment[]> {
    return await this.assignmentRepository.find({
      where: { createdBy: { id: userId } },
      relations: ['createdBy'],
    });
  }

  async findWithSubmissions(assignmentId: number): Promise<Assignment | undefined> {
    return await this.assignmentRepository.findOne({
      where: { id: assignmentId },
      relations: ['submissions'],
    });
  }

  async findWithRubricVersions(assignmentId: number): Promise<Assignment | undefined> {
    return await this.assignmentRepository.findOne({
      where: { id: assignmentId },
      relations: ['rubricVersions'],
    });
  }

  async addAssignmentToClassroom(assignmentId: number, classroomId: number): Promise<Assignment> {
    const assignment = await this.findById(assignmentId);
    const classroom = await this.assignmentRepository.manager.findOne(Classroom, { where: { id: classroomId } });
    
    if (assignment && classroom) {
      assignment.classroom = classroom;
      return await this.assignmentRepository.save(assignment);
    }
    throw new Error('Assignment or Classroom not found');
  }

  async setCreator(assignmentId: number, userId: number): Promise<Assignment> {
    const assignment = await this.findById(assignmentId);
    const user = await this.assignmentRepository.manager.findOne(User, { where: { id: userId } });
    
    if (assignment && user) {
      assignment.createdBy = user;
      return await this.assignmentRepository.save(assignment);
    }
    throw new Error('Assignment or User not found');
  }

  async findUpcomingAssignments(daysAhead: number = 7): Promise<Assignment[]> {
    const currentDate = new Date();
    const futureDate = new Date(currentDate.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    
    return await this.assignmentRepository.createQueryBuilder('assignment')
      .where('assignment.dueDate > :currentDate', { currentDate })
      .andWhere('assignment.dueDate <= :futureDate', { futureDate })
      .orderBy('assignment.dueDate', 'ASC')
      .getMany();
  }

  async countSubmissions(assignmentId: number): Promise<number> {
    const assignment = await this.findWithSubmissions(assignmentId);
    return assignment ? assignment.submissions.length : 0;
  }
}