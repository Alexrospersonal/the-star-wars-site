import { Module, forwardRef } from '@nestjs/common';
import { PlanetsController } from './planets.controller';
import { PlanetsService } from './planets.service';
import { DatabaseModule } from 'src/database/database.module';
import { ImagesModule } from 'src/images/images.module';
import { PeopleModule } from 'src/people/people.module';

@Module({
    imports: [DatabaseModule, ImagesModule, forwardRef(() => PeopleModule)],
    controllers: [PlanetsController],
    providers: [PlanetsService]
})
export class PlanetsModule { }
