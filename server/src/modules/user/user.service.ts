import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../database/repositories/User.repository';
import { User } from '../../database/entities/User.entity';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userData: Partial<User>): Promise<User> {
    return this.userRepository.create(userData);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.userRepository.update(id, userData);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getUserWithEnrollments(id: number): Promise<User> {
    const user = await this.userRepository.findWithEnrolledClassrooms(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async enrollStudentInClassroom(userId: number, classroomId: number): Promise<User> {
    return this.userRepository.addStudentToClassroom(userId, classroomId);
  }

  async getTeachersWithClassrooms(): Promise<User[]> {
    return this.userRepository.findTeachersWithClassrooms();
  }

  async getStudentsWithEnrollments(): Promise<User[]> {
    return this.userRepository.findStudentsWithEnrollments();
  }
}