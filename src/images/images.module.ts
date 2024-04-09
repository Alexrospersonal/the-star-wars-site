import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [ImagesService],
    exports: [ImagesService]
})
export class ImagesModule { }
