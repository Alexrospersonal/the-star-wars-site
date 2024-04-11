import { Module } from '@nestjs/common';
import { PlanetsController } from './planets.controller';
import { PlanetsService } from './planets.service';
import { DatabaseModule } from 'src/database/database.module';
import { ImagesModule } from 'src/images/images.module';

@Module({
    imports: [DatabaseModule, ImagesModule],
    controllers: [PlanetsController],
    providers: [PlanetsService]
})
export class PlanetsModule { }
