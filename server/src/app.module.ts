import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAiModule } from './modules/open-ai/openAi.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ClaudeModule } from './modules/claude/claude.module';
//import all entities here
import { User } from './database/entities/User.entity';
import { Classroom } from './database/entities/Classroom.entity';
import { Assignment } from './database/entities/Assignment.entity';
import { RubricTemplate } from './database/entities/RubricTemplate.entity';
import { RubricCriteria } from './database/entities/RubricCriteria.entity';
import { RubricVersion } from './database/entities/RubricVersion.entity';
import { CriteriaExample } from './database/entities/CriteriaExample.entity';
import { Feedback } from './database/entities/Feedback.entity';
import { StudentSubmission } from './database/entities/StudentSubmission.entity';
import { UserModule } from './modules/user/user.module';
import { MyGateway } from './gateway/gateway';
import { databaseConfig } from './config/database.config';
import { RubricModule } from './modules/rubric/rubric.module';
import { AssignmentModule } from './modules/assignment/assignment.module';
import { SubmissionModule } from './modules/submission/submission.module';
import { AuthModule } from './modules/auth/auth.module';



@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', '.env'),
      isGlobal: true,
    }),
    OpenAiModule,
    ClaudeModule,
    UserModule,
    RubricModule,
    AssignmentModule,
    SubmissionModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, MyGateway],
})
export class AppModule {}