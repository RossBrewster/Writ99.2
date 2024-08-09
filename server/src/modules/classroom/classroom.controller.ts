import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { CreateClassroomDto } from './dto/createClassroom.dto';
import { UpdateClassroomDto } from './dto/updateClassroom.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('classrooms')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Post()
//   @Roles('admin', 'teacher')
  create(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomService.create(createClassroomDto);
  }

  @Get()
//   @Roles('admin', 'teacher', 'student')
  findAll() {
    return this.classroomService.findAll();
  }

  @Get(':id')
//   @Roles('admin', 'teacher', 'student')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classroomService.findOne(id);
  }

  @Patch(':id')
//   @Roles('admin', 'teacher')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateClassroomDto: UpdateClassroomDto) {
    return this.classroomService.update(id, updateClassroomDto);
  }

  @Delete(':id')
//   @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.classroomService.remove(id);
  }

  @Get('teacher/:teacherId')
//   @Roles('admin', 'teacher')
  findByTeacher(@Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.classroomService.findByTeacher(teacherId);
  }

  @Post(':id/students/:studentId')
//   @Roles('admin', 'teacher')
  addStudent(
    @Param('id', ParseIntPipe) id: number,
    @Param('studentId', ParseIntPipe) studentId: number
  ) {
    return this.classroomService.addStudent(id, studentId);
  }

  @Delete(':id/students/:studentId')
//   @Roles('admin', 'teacher')
  removeStudent(
    @Param('id', ParseIntPipe) id: number,
    @Param('studentId', ParseIntPipe) studentId: number
  ) {
    return this.classroomService.removeStudent(id, studentId);
  }

  @Patch(':id/teacher/:teacherId')
//   @Roles('admin')
  setTeacher(
    @Param('id', ParseIntPipe) id: number,
    @Param('teacherId', ParseIntPipe) teacherId: number
  ) {
    return this.classroomService.setTeacher(id, teacherId);
  }
}