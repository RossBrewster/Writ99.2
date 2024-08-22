import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { UserService } from '../user/user.service';
import { CreateClassroomDto} from './dto/createClassroom.dto';
import { UpdateClassroomDto } from './dto/updateClassroom.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { User } from '../../shared/decorators/user.decorator';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { ClassroomDto } from './dto/classroom.dto';
// import { TestUser } from '../../shared/decorators/user.decorator';

@Controller('classrooms')
@UseGuards(JwtAuthGuard)
export class ClassroomController {
  constructor(
    private readonly classroomService: ClassroomService,
    private readonly userService: UserService
  ) {}
  
  @Post()
  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  async create(@Body() createClassroomDto: CreateClassroomDto, @User() user: any) {
    createClassroomDto.teacherId = user.id;
    return await this.classroomService.create(createClassroomDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin', 'student')
  async findAll() {
    return await this.classroomService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin', 'student')
  async findOne(@Param('id') id: string) {
    const classroom = await this.classroomService.findOne(+id);
    if (!classroom) {
      throw new HttpException('Classroom not found', HttpStatus.NOT_FOUND);
    }
    return classroom;
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  async update(@Param('id') id: string, @Body() updateClassroomDto: UpdateClassroomDto, @User() user: any) {
    const classroom = await this.classroomService.findOne(+id);
    if (!classroom) {
      throw new HttpException('Classroom not found', HttpStatus.NOT_FOUND);
    }
    if (classroom.teacherId !== user.id && user.role !== 'admin') {
      throw new HttpException('You are not authorized to update this classroom', HttpStatus.FORBIDDEN);
    }
    return await this.classroomService.update(+id, updateClassroomDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  async remove(@Param('id') id: string, @User() user: any) {
    const classroom = await this.classroomService.findOne(+id);
    if (!classroom) {
      throw new HttpException('Classroom not found', HttpStatus.NOT_FOUND);
    }
    if (classroom.teacherId !== user.id && user.role !== 'admin') {
      throw new HttpException('You are not authorized to delete this classroom', HttpStatus.FORBIDDEN);
    }
    return await this.classroomService.remove(+id);
  }

  @Post(':id/generate-invitation')
  @UseGuards(RolesGuard)
  @Roles('teacher')
  async generateInvitation(@Param('id') id: string, @User() user: any) {
    console.log('User attempting to generate invitation:', user);
    console.log('For classroom:', id);
  
    const classroom = await this.classroomService.findOne(+id);
    console.log('Classroom found:', classroom);
  
    if (!classroom) {
      throw new HttpException('Classroom not found', HttpStatus.NOT_FOUND);
    }
    
    // Use user.id or user.userId, whichever is correct
    if (classroom.teacherId !== user.id && classroom.teacherId !== user.userId) {
      console.log('User id:', user.id || user.userId, 'Teacher id:', classroom.teacherId);
      throw new HttpException('You are not authorized to generate an invitation for this classroom', HttpStatus.FORBIDDEN);
    }
    
    const code = await this.classroomService.generateInvitationCode(+id);
    return { code };
  }

  @Post('join')
  async joinClassroom(@Body() body: { invitationCode: string }, @User() user: any): Promise<{ message: string, user: UserResponseDto }> {
    try {
      const updatedUser = await this.userService.joinClassroom(user.id, body.invitationCode);
      return { message: 'Successfully joined the classroom', user: updatedUser };
    } catch (error) {
      if (error.message === 'Invalid invitation code' || error.message === 'Invitation code has expired') {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else if (error.message === 'You are already enrolled in this classroom') {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new HttpException('An error occurred while joining the classroom', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Get('teacher/:teacherId')
  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  async findByTeacher(@Param('teacherId') teacherId: string, @User() user: any): Promise<ClassroomDto[]> {
    if (user.id !== +teacherId && user.role !== 'admin') {
      throw new HttpException('You are not authorized to view these classrooms', HttpStatus.FORBIDDEN);
    }
    return this.classroomService.findByTeacher(+teacherId);
  }
}