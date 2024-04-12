import { Injectable } from '@nestjs/common';
import { CreatePeopleDto } from './people.dto';
import { ImagesService } from 'src/images/images.service';
import { DataBaseService } from 'src/database/database.service';


@Injectable()
export class PeopleService {
    constructor(
        private readonly dataBaseService: DataBaseService,
        private readonly imagesService: ImagesService
    ) { }

    async create(person: CreatePeopleDto, files: Array<Express.Multer.File>) {
        return await this.dataBaseService.createPerson(person, files);
    }
    async findOne(id: number) {
        const person = await this.dataBaseService.findPerson(id);

        person.images = this.imagesService.convertFilenametoURL(person.images);

        return person;
    }
}
