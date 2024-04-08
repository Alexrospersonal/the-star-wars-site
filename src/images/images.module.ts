import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './images.entity';
import { ImagesService } from './images.service';

@Module({
    imports: [TypeOrmModule.forFeature([Image])],
    providers: [ImagesService],
    exports: [ImagesService]
})
export class ImagesModule { }
