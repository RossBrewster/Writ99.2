export class UserResponseDto {
    id: number;
    username: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    // Add other non-sensitive fields as needed
  }