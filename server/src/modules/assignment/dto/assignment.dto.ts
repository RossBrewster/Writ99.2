import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

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


  export class CreateAssignmentDto {
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsString()
    @IsNotEmpty()
    prompt: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @IsString()
    @IsNotEmpty()
    instructions: string;
  
    @IsString()
    @IsOptional()
    readingMaterial?: string;
  
    @IsNumber()
    @Min(0)
    minimumDrafts: number;
  
    @IsNumber()
    @IsNotEmpty()
    createdById: number;
  }