import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Image } from "src/images/images.entity";
import { Person } from "src/people/entities/people.entity";
import { CreatePeopleDto } from "src/people/people.dto";
import { CreatePlanetDto } from "src/planets/planets.dto";
import { Planet } from "src/planets/planets.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class DataBaseService {
    constructor(
        @InjectRepository(Person)
        private peopleRepository: Repository<Person>,
        @InjectRepository(Image)
        private imageRepository: Repository<Image>,
        @InjectRepository(Planet)
        private planetRepository: Repository<Planet>,
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

        const homeworld = await this.planetRepository.findOne({
            where: {
                id: personData.homeworld
            }
        });

        const person = this.peopleRepository.create({
            name: personData.name,
            birth_year: personData.birth_year,
            eye_color: personData.eye_color,
            gender: personData.gender,
            hair_color: personData.hair_color,
            height: personData.height,
            mass: personData.mass,
            skin_color: personData.skin_color,
            homeworld: homeworld,
            images: images
        });

        const createdPerson = await this.peopleRepository.save(person);

        homeworld.residents.push(person);
        await this.planetRepository.save(homeworld);

        return createdPerson;
    }

    public async createPlanet(planetData: CreatePlanetDto, files: Array<Express.Multer.File>) {
        const images = await this.saveImages(files);

        const planet = this.planetRepository.create({
            name: planetData.name,
            diameter: planetData.diameter,
            rotation_period: planetData.rotation_period,
            orbital_period: planetData.orbital_period,
            gravity: planetData.gravity,
            population: planetData.population,
            climate: planetData.climate,
            terrain: planetData.terrain,
            surface_water: planetData.surface_water,
            residents: [],
            images: images
        });

        return await this.planetRepository.save(planet);
    }
}