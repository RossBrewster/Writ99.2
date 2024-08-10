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

  async joinClassroom(userId: number, invitationCode: string): Promise<User> {
    try {
      return await this.userRepository.joinClassroomByInvitationCode(userId, invitationCode);
    } catch (error) {
      // Handle specific errors
      if (error.message === 'User not found') {
        throw new Error('User not found');
      } else if (error.message === 'Invalid invitation code') {
        throw new Error('Invalid invitation code');
      } else if (error.message === 'Invitation code has expired') {
        throw new Error('Invitation code has expired');
      } else if (error.message === 'User is already enrolled in this classroom') {
        throw new Error('You are already enrolled in this classroom');
      }
      // For any other errors, throw a generic error
      throw new Error('An error occurred while joining the classroom');
    }
  }
}