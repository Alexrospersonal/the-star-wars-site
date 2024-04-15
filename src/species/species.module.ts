import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { Species } from './species.entity';
import { ImagesModule } from 'src/images/images.module';
import { PlanetsModule } from 'src/planets/planets.module';
import { PeopleModule } from 'src/people/people.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Species]),
        ImagesModule,
        forwardRef(() => PlanetsModule),
        forwardRef(() => PeopleModule)
    ],
    controllers: [SpeciesController],
    providers: [SpeciesService],
    exports: [SpeciesService]
})
export class SpeciesModule { }
