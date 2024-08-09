import { Injectable, NotFoundException } from '@nestjs/common';
import { ClassroomRepository } from '../../database/repositories/Classroom.repository';
import { UserRepository } from '../../database/repositories/User.repository';
import { Classroom } from '../../database/entities/Classroom.entity';
import { CreateClassroomDto } from './dto/createClassroom.dto';
import { UpdateClassroomDto } from './dto/updateClassroom.dto';

@Injectable()
export class ClassroomService {
  constructor(
    private classroomRepository: ClassroomRepository,
    private userRepository: UserRepository
  ) {}

  async create(createClassroomDto: CreateClassroomDto): Promise<Classroom> {
    const { teacherId, ...classroomData } = createClassroomDto;
    const teacher = await this.userRepository.findById(teacherId);
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }
    return this.classroomRepository.create({
      ...classroomData,
      teacherId,
      teacher
    });
  }

  async findAll(): Promise<Classroom[]> {
    return this.classroomRepository.findAll();
  }

  async findOne(id: number): Promise<Classroom> {
    const classroom = await this.classroomRepository.findById(id);
    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }
    return classroom;
  }

  async update(id: number, updateClassroomDto: UpdateClassroomDto): Promise<Classroom> {
    const updatedClassroom = await this.classroomRepository.update(id, updateClassroomDto);
    if (!updatedClassroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }
    return updatedClassroom;
  }

  async remove(id: number): Promise<void> {
    const result = await this.classroomRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }
  }

  async findByTeacher(teacherId: number): Promise<Classroom[]> {
    return this.classroomRepository.findByTeacher(teacherId);
  }

  async addStudent(classroomId: number, studentId: number): Promise<Classroom> {
    return this.classroomRepository.addStudent(classroomId, studentId);
  }

  async removeStudent(classroomId: number, studentId: number): Promise<Classroom> {
    return this.classroomRepository.removeStudent(classroomId, studentId);
  }

  async setTeacher(classroomId: number, teacherId: number): Promise<Classroom> {
    return this.classroomRepository.setTeacher(classroomId, teacherId);
  }
}