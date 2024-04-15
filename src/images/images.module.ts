import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './images.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Image])],
    providers: [ImagesService],
    controllers: [ImagesController],
    exports: [ImagesService]
})
export class ImagesModule { }
