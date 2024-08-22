import { UserResponseDto } from '../../user/dto/user-response.dto';
import { Classroom } from '../../../database/entities/Classroom.entity';

export class ClassroomDto {
  id: number;
  name: string;
  description: string;
  teacherId: number;
  invitationCode: string | null;
  invitationCodeExpiration: Date | null;
  teacher: UserResponseDto;

  static fromEntity(classroom: Classroom): ClassroomDto {
    return {
      id: classroom.id,
      name: classroom.name,
      description: classroom.description,
      teacherId: classroom.teacherId,
      invitationCode: classroom.invitationCode,
      invitationCodeExpiration: classroom.invitationCodeExpiration,
      teacher: UserResponseDto.fromEntity(classroom.teacher)
    };
  }
}