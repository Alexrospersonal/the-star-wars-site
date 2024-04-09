import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from 'src/people/entities/people.entity';
import { DataBaseService } from './database.service';
import { Image } from 'src/images/images.entity';
import { Planet } from 'src/planets/planets.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Image]),
        TypeOrmModule.forFeature([Person]),
        TypeOrmModule.forFeature([Planet]),
    ],
    providers: [DataBaseService],
    exports: [DataBaseService]
})
export class DatabaseModule { }
