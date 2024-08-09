import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Classroom } from '../entities/Classroom.entity';
import { User } from '../entities/User.entity';

@Injectable()
export class ClassroomRepository {
  constructor(
    @InjectRepository(Classroom)
    private classroomRepository: Repository<Classroom>,
  ) {}

  async create(classroomData: Partial<Classroom>): Promise<Classroom> {
    const classroom = this.classroomRepository.create(classroomData);
    return await this.classroomRepository.save(classroom);
  }

  async findAll(): Promise<Classroom[]> {
    return await this.classroomRepository.find();
  }

  async findById(id: number, relations: string[] = []): Promise<Classroom | undefined> {
    return await this.classroomRepository.findOne({ where: { id }, relations });
  }

  async update(id: number, classroomData: Partial<Classroom>): Promise<Classroom | undefined> {
    await this.classroomRepository.update(id, classroomData);
    return this.findById(id);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.classroomRepository.delete(id);
  }

  async findByTeacher(teacherId: number): Promise<Classroom[]> {
    return await this.classroomRepository.find({
      where: { teacher: { id: teacherId } },
      relations: ['teacher'],
    });
  }

  async findWithStudents(classroomId: number): Promise<Classroom | undefined> {
    return await this.classroomRepository.findOne({
      where: { id: classroomId },
      relations: ['students'],
    });
  }

  async findWithAssignments(classroomId: number): Promise<Classroom | undefined> {
    return await this.classroomRepository.findOne({
      where: { id: classroomId },
      relations: ['assignments'],
    });
  }

  async addStudent(classroomId: number, studentId: number): Promise<Classroom> {
    const classroom = await this.findWithStudents(classroomId);
    const student = await this.classroomRepository.manager.findOne(User, { where: { id: studentId } });
    
    if (classroom && student) {
      classroom.students.push(student);
      return await this.classroomRepository.save(classroom);
    }
    throw new Error('Classroom or Student not found');
  }

  async removeStudent(classroomId: number, studentId: number): Promise<Classroom> {
    const classroom = await this.findWithStudents(classroomId);
    
    if (classroom) {
      classroom.students = classroom.students.filter(student => student.id !== studentId);
      return await this.classroomRepository.save(classroom);
    }
    throw new Error('Classroom not found');
  }

  async setTeacher(classroomId: number, teacherId: number): Promise<Classroom> {
    const classroom = await this.findById(classroomId);
    const teacher = await this.classroomRepository.manager.findOne(User, { where: { id: teacherId } });
    
    if (classroom && teacher) {
      classroom.teacher = teacher;
      return await this.classroomRepository.save(classroom);
    }
    throw new Error('Classroom or Teacher not found');
  }
}