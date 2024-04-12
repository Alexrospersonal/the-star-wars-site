import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Image } from "src/images/images.entity";
import { Person } from "src/people/entities/people.entity";
import { CreatePeopleDto, UpdatePeopleDto } from "src/people/people.dto";
import { CreatePlanetDto, UpdatePlanetDto } from "src/planets/planets.dto";
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
        const name = file.path;
        const image = this.imageRepository.create({ name });
        return await this.imageRepository.save(image);
    }

    public async saveImages(files: Array<Express.Multer.File>) {
        const images: Image[] = [];

        for (const file of files) {
            images.push(await this.saveImage(file));
        }

        return images;
    }

    public async deleteImage(id: number) {
        const image = await this.imageRepository.findOne({ where: { id: id } });

        if (!image) {
            throw new NotFoundException(`Person #${id} not found`);
        }

        return await this.imageRepository.remove(image);
    }

    public async getOneImage(id: number) {
        return await this.imageRepository.findOne({ where: { id: id } });
    }

    public async createPerson(personData: CreatePeopleDto, files: Array<Express.Multer.File>) {
        const images = await this.saveImages(files);

        const homeworld = await this.planetRepository.findOne({
            where: {
                id: personData.homeworld
            },
            relations: ['residents']
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

        if (homeworld) {
            homeworld.residents.push(person);
        }
        await this.planetRepository.save(homeworld);

        return createdPerson;
    }

    public findPeople(skip: number, take: number) {
        return this.peopleRepository.find({
            skip: skip,
            take: take,
            relations: ['images', 'homeworld']
        });
    }

    public findPerson(id: number) {
        return this.peopleRepository.findOne({
            where: {
                id: id
            },
            relations: ['images', 'homeworld']
        });
    }

    public async updatePerson(id: number, updatePersonData: UpdatePeopleDto) {
        const updatedObject = {
            id: id,
            ...updatePersonData,
            homeworld: await this.planetRepository.findOne({ where: { id: updatePersonData.homeworld } })
        };

        const oldPerson = await this.peopleRepository.findOne({ where: { id: id } });
        const newPerson = await this.peopleRepository.preload(updatedObject);

        if (!newPerson)
            throw new NotFoundException(`Person #${id} not found`);

        if (oldPerson.homeworld.id !== newPerson.homeworld.id) {
            const oldPlanet = await this.planetRepository.findOne({ where: { id: oldPerson.homeworld.id } });
            oldPlanet.residents = oldPlanet.residents.filter((person, idx, arr) => {
                person !== oldPerson
            });
            await this.planetRepository.save(oldPlanet);

            const newPlanet = await this.planetRepository.findOne({ where: { id: newPerson.homeworld.id } });
            newPlanet.residents.push(newPerson);
        }

        return await this.peopleRepository.save(newPerson);
    }

    public async deletePerson(id: number) {
        const person = await this.peopleRepository.findOne({ where: { id: id } });

        if (!person)
            throw new NotFoundException(`Person #${id} not found`);

        const planetId = person.homeworld.id;

        const removedPerson = await this.peopleRepository.remove(person);

        const planet = await this.planetRepository.findOne({ where: { id: planetId } });
        planet.residents = planet.residents.filter(p => p !== person);
        await this.planetRepository.save(planet);

        return removedPerson;
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

    public async findOnePlanet(id: number) {
        const planet = await this.planetRepository.findOne(
            {
                where: { id: id },
                relations: ['images', 'residents']
            }
        );

        if (!planet) {
            throw new NotFoundException(`Planet #${id} not found`);
        }

        return planet;
    }

    public findAllPlanet(skip: number, take: number) {
        return this.peopleRepository.find({
            skip: skip,
            take: take,

        });
    }

    public async updatePlanet(id: number, updatePlanetData: UpdatePlanetDto) {
        const updatePlanet = await this.planetRepository.preload({
            id: id,
            ...updatePlanetData
        });

        if (!updatePlanet) {
            throw new NotFoundException(`Planet #${id} not found`);
        }

        return await this.planetRepository.save(updatePlanet);
    }

    public async deletePlanet(id: number) {
        const planet = await this.planetRepository.findOne({ where: { id: id } });

        if (!planet) {
            throw new NotFoundException(`Planet #${id} not found`);
        }

        const residents = planet.residents.map(person => {
            person.homeworld = null;
            return person;
        });

        this.peopleRepository.save(residents);

        return await this.planetRepository.remove(planet);
    }
}