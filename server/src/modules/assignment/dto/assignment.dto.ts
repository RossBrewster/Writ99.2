// dto/assignment.dto.ts
export class CreateAssignmentDto {
    title: string;
    description: string;
    passage: string;
    prompt: string;
    dueDate: Date;
    // Add other necessary fields
  }
  
  export class UpdateAssignmentDto {
    title?: string;
    description?: string;
    dueDate?: Date;
    // Add other necessary fields
  }