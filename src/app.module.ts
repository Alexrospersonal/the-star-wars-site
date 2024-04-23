import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PeopleModule } from './people/people.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ImagesModule } from './images/images.module';
import { PlanetsModule } from './planets/planets.module';
import { SpeciesModule } from './species/species.module';
import { StarshipsModule } from './starships/starships.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'star_wars',
      autoLoadEntities: true,
      synchronize: true
    }), PeopleModule, ImagesModule, PlanetsModule, SpeciesModule, StarshipsModule, VehiclesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { private dataSouce: DataSource }
