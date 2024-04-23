import { Module, forwardRef } from '@nestjs/common';
import { Vehicles } from './vehicles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesModule } from 'src/images/images.module';
import { PeopleModule } from 'src/people/people.module';
import { vehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Vehicles]),
        ImagesModule,
        forwardRef(() => PeopleModule)
    ],
    controllers: [vehiclesController],
    providers: [VehiclesService],
    exports: [VehiclesService]
})
export class VehiclesModule { }
