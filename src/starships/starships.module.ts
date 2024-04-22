import { Module, forwardRef } from '@nestjs/common';
import { StarshipsController } from './starships.controller';
import { StarshipsService } from './starship.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Starships } from './starship.entity';
import { ImagesModule } from 'src/images/images.module';
import { PeopleModule } from 'src/people/people.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Starships]),
        ImagesModule,
        forwardRef(() => PeopleModule)
    ],
    controllers: [StarshipsController],
    providers: [StarshipsService],
    exports: [StarshipsService]
})
export class StarshipsModule { }
