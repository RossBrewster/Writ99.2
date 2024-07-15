import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from "../database/entities/User.entity";
import { RubricTemplate } from "../database/entities/RubricTemplate.entity";
import { RubricCriteria } from "../database/entities/RubricCriteria.entity";
import { RubricVersion } from "../database/entities/RubricVersion.entity";
import { Assignment } from "../database/entities/Assignment.entity";
import { Classroom } from "../database/entities/Classroom.entity";
import { CriteriaExample } from 'src/database/entities/CriteriaExample.entity';
import { Feedback } from 'src/database/entities/Feedback.entity';
import { StudentSubmission } from 'src/database/entities/StudentSubmission.entity';


export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'rossbrewster',
  password: '',
  database: 'writ99',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
};