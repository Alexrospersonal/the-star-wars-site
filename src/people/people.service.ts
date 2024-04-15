import { Injectable, NotFoundException, UseInterceptors } from '@nestjs/common';
import { CreatePeopleDto, UpdatePeopleDto } from './people.dto';
import { ImagesService } from 'src/images/images.service';
import { FileUrlTransformInteceptor } from 'src/interceptors/fileUrlTransform.interceptor';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/people.entity';
import { Repository } from 'typeorm';
import { PlanetsService } from 'src/planets/planets.service';


@Injectable()
@UseInterceptors(FileUrlTransformInteceptor)
export class PeopleService {
    constructor(
        @InjectRepository(Person)
        private peopleRepository: Repository<Person>,
        private readonly imagesService: ImagesService,
        private readonly planetsService: PlanetsService
    ) { }

    async create(person: CreatePeopleDto, files: Array<Express.Multer.File>) {
        return await this.createPerson(person, files);
    }
    async findOne(id: number) {
        const person = await this.findPerson(id);

        // person.images = this.imagesService.convertFilenametoURL(person.images);

        return person;
    }

    public async createPerson(personData: CreatePeopleDto, files: Array<Express.Multer.File>) {
        const images = await this.imagesService.saveImages(files);

        const homeworld = await this.planetsService.getHomeword(personData.homeworld);

        if (!homeworld)
            throw new NotFoundException(`Homeword #${personData.homeworld} not found`);

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

        await this.planetsService.addNewResident(createdPerson.homeworld, createdPerson);

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
            homeworld: await this.planetsService.getHomeword(updatePersonData.homeworld)
        };

        const oldPerson = await this.peopleRepository.findOne({ where: { id: id } });
        const newPerson = await this.peopleRepository.preload(updatedObject);

        if (!newPerson)
            throw new NotFoundException(`Person #${id} not found`);

        if (oldPerson.homeworld.id !== newPerson.homeworld.id) {

            const oldPlanet = await this.planetsService.findOnePlanet(oldPerson.homeworld.id);
            const newPlanet = await this.planetsService.findOnePlanet(newPerson.homeworld.id);

            await this.planetsService.removeResident(oldPlanet, oldPerson);
            await this.planetsService.addNewResident(newPlanet, newPerson);
        }

        return await this.peopleRepository.save(newPerson);
    }

    public async deletePerson(id: number) {
        const person = await this.peopleRepository.findOne({ where: { id: id } });

        if (!person)
            throw new NotFoundException(`Person #${id} not found`);

        // const planetId = person.homeworld.id;

        const removedPerson = await this.peopleRepository.remove(person);

        // const planet = await this.planetRepository.findOne({ where: { id: planetId } });
        // planet.residents = planet.residents.filter(p => p !== person);
        // await this.planetRepository.save(planet);

        return removedPerson;
    }
}
