import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Films } from './films.entity';
import { ImagesModule } from 'src/images/images.module';
import { PeopleModule } from 'src/people/people.module';
import { PlanetsModule } from 'src/planets/planets.module';
import { SpeciesModule } from 'src/species/species.module';
import { StarshipsModule } from 'src/starships/starships.module';
import { VehiclesModule } from 'src/vehicles/vehicles.module';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Films]),
        ImagesModule,
        forwardRef(() => PeopleModule),
        forwardRef(() => PlanetsModule),
        forwardRef(() => SpeciesModule),
        forwardRef(() => StarshipsModule),
        forwardRef(() => VehiclesModule),
    ],
    controllers: [FilmsController],
    providers: [FilmsService],
    exports: [FilmsService]
})
export class FilmsModule { }
