import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto, UpdateSubmissionDto } from './dto/submission.dto';

@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  async create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return await this.submissionService.create(createSubmissionDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.submissionService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSubmissionDto: UpdateSubmissionDto) {
    return await this.submissionService.update(+id, updateSubmissionDto);
  }

  @Get('assignment/:assignmentId')
  async findByAssignment(@Param('assignmentId') assignmentId: string) {
    return await this.submissionService.findByAssignment(+assignmentId);
  }
}