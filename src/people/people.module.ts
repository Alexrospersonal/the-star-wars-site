import { Module, forwardRef } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { ImagesModule } from 'src/images/images.module';
import { PlanetsModule } from 'src/planets/planets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/people.entity';
import { SpeciesModule } from 'src/species/species.module';

@Module({
  imports: [
    ImagesModule, forwardRef(() => PlanetsModule),
    TypeOrmModule.forFeature([Person]),
    SpeciesModule
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService]
})
export class PeopleModule { }
