import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Image } from "src/images/images.entity";
import { Person } from "src/people/entities/people.entity";
import { CreatePeopleDto } from "src/people/people.dto";
import { Repository } from "typeorm";

@Injectable()
export class DataBaseService {
    constructor(
        @InjectRepository(Person)
        private peopleRepository: Repository<Person>,
        @InjectRepository(Image)
        private imageRepository: Repository<Image>
    ) { }

    private async saveImage(file: Express.Multer.File) {
        const name = file.filename;
        const image = this.imageRepository.create({ name });
        return await this.imageRepository.save(image);
    }

    public async saveImages(files: Array<Express.Multer.File>) {
        const Images: Image[] = [];

        for (const file of files) {
            Images.push(await this.saveImage(file));
        }

        return Images;
    }

    public async createPerson(personData: CreatePeopleDto, files: Array<Express.Multer.File>) {
        const images = await this.saveImages(files);

        const person = this.peopleRepository.create({
            name: personData.name,
            birth_year: personData.birth_year,
            eye_color: personData.eye_color,
            gender: personData.gender,
            hair_color: personData.hair_color,
            height: personData.height,
            mass: personData.mass,
            skin_color: personData.skin_color,
            homeworld: personData.homeworld,
            images: [...images]
        });

        return await this.peopleRepository.save(person);
    }
}