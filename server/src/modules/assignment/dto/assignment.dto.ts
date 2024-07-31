// dto/assignment.dto.ts
export class CreateAssignmentDto {
    title: string;
    description: string;
    instructions: string;
    readingMaterial?: string;
    prompt: string;
    minimumDrafts: number;
    dueDate: Date;
    createdById?: number;
    classroomId?: number;
  }
  
  export class UpdateAssignmentDto {
    title?: string;
    description?: string;
    instructions?: string;
    readingMaterial?: string;
    prompt?: string;
    minimumDrafts?: number;
    dueDate?: Date;
    createdById?: number;
    classroomId?: number;
  }