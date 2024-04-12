import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { DatabaseModule } from 'src/database/database.module';
import { ImagesController } from './images.controller';

@Module({
    imports: [DatabaseModule],
    providers: [ImagesService],
    controllers: [ImagesController],
    exports: [ImagesService]
})
export class ImagesModule { }
