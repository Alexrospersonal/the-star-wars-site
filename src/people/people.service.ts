import { Injectable, NotFoundException, UseInterceptors } from '@nestjs/common';
import { CreatePeopleDto, UpdatePeopleDto } from './people.dto';
import { ImagesService } from 'src/images/images.service';
import { FileUrlTransformInteceptor } from 'src/interceptors/fileUrlTransform.interceptor';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/people.entity';
import { Repository } from 'typeorm';
import { PlanetsService } from 'src/planets/planets.service';
import { SpeciesService } from 'src/species/species.service';


@Injectable()
@UseInterceptors(FileUrlTransformInteceptor)
export class PeopleService {
    constructor(
        @InjectRepository(Person)
        private peopleRepository: Repository<Person>,
        private readonly imagesService: ImagesService,
        private readonly planetsService: PlanetsService,
        private readonly speciesService: SpeciesService,
    ) { }

    async findOne(id: number) {
        const person = await this.findPerson(id);

        return person;
    }

    public async createPerson(personData: CreatePeopleDto, files: Array<Express.Multer.File>) {
        const images = await this.imagesService.saveImages(files);

        const homeworld = await this.planetsService.getHomeword(personData.homeworld);
        const specie = await this.speciesService.findSpecie(personData.specie)

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
            homeworld: Promise.resolve(homeworld),
            specie: Promise.resolve(specie),
            images: Promise.resolve(images)
        });

        const createdPerson = await this.peopleRepository.save(person);

        await this.planetsService.addNewResident(homeworld, createdPerson);

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
            relations: ['images', 'homeworld', 'specie']
        });
    }

    public async updatePerson(id: number, updatePersonData: UpdatePeopleDto) {
        const updatedObject = {
            id: id,
            ...updatePersonData,
            homeworld: Promise.resolve(await this.planetsService.getHomeword(updatePersonData.homeworld)),
            specie: Promise.resolve(await this.speciesService.findSpecie(updatePersonData.specie)),
        };

        const oldPerson = await this.peopleRepository.findOne({ where: { id: id } });
        const newPerson = await this.peopleRepository.preload(updatedObject);

        const oldPersonHomeworld = await oldPerson.homeworld;
        const newPersonHomeworld = await newPerson.homeworld;

        if (!newPerson)
            throw new NotFoundException(`Person #${id} not found`);

        if (oldPersonHomeworld.id !== newPersonHomeworld.id) {

            const oldPlanet = await this.planetsService.findOnePlanet(oldPersonHomeworld.id);
            const newPlanet = await this.planetsService.findOnePlanet(newPersonHomeworld.id);

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
