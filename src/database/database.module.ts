import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from 'src/people/entities/people.entity';
import { DataBaseService } from './database.service';
import { Image } from 'src/images/images.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Image]),
        TypeOrmModule.forFeature([Person]),
    ],
    providers: [DataBaseService],
    exports: [DataBaseService]
})
export class DatabaseModule { }
