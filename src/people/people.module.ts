import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { DatabaseModule } from 'src/database/database.module';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [DatabaseModule, ImagesModule],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule { }
