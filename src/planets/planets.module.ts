import { Module, forwardRef } from '@nestjs/common';
import { PlanetsController } from './planets.controller';
import { PlanetsService } from './planets.service';
import { ImagesModule } from 'src/images/images.module';
import { PeopleModule } from 'src/people/people.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planet } from './planets.entity';

@Module({
    imports: [
        ImagesModule, forwardRef(() => PeopleModule),
        TypeOrmModule.forFeature([Planet])
    ],
    controllers: [PlanetsController],
    providers: [PlanetsService],
    exports: [PlanetsService]
})
export class PlanetsModule { }
