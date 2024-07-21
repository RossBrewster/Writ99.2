import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto/assignment.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';

@Controller('assignments')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  // @Roles('teacher', 'admin')
  async create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return await this.assignmentService.create(createAssignmentDto);
  }

  @Get()
  // @Roles('teacher', 'admin', 'student')
  async findAll() {
    return await this.assignmentService.findAll();
  }

  @Get(':id')
  // @Roles('teacher', 'admin', 'student')
  async findOne(@Param('id') id: string) {
    return await this.assignmentService.findOne(+id);
  }

  @Put(':id')
  // @Roles('teacher', 'admin')
  async update(@Param('id') id: string, @Body() updateAssignmentDto: UpdateAssignmentDto) {
    return await this.assignmentService.update(+id, updateAssignmentDto);
  }

  @Delete(':id')
  // @Roles('teacher', 'admin')
  async remove(@Param('id') id: string) {
    return await this.assignmentService.remove(+id);
  }
}