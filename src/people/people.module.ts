import { Module, forwardRef } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { DatabaseModule } from 'src/database/database.module';
import { ImagesModule } from 'src/images/images.module';
import { PlanetsModule } from 'src/planets/planets.module';

@Module({
  imports: [DatabaseModule, ImagesModule, forwardRef(() => PlanetsModule)],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule { }
