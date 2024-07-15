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



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'rossbrewster',
      password: '',
      database: 'crisis-management',
      entities: [User, Classroom, Assignment, RubricTemplate, RubricCriteria, RubricVersion, CriteriaExample, Feedback, StudentSubmission],
      synchronize: true, // Be cautious with this in production
    }),
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', '.env'),
      isGlobal: true,
    }),
    OpenAiModule,
    ClaudeModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService, MyGateway],
})
export class AppModule {}