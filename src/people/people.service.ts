import { Injectable, NotFoundException, UseInterceptors } from '@nestjs/common';
import { CreatePeopleDto, UpdatePeopleDto } from './people.dto';
import { ImagesService } from 'src/images/images.service';
import { FileUrlTransformInterceptor } from 'src/interceptors/fileUrlTransform.interceptor';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/people.entity';
import { In, Repository } from 'typeorm';
import { PlanetsService } from 'src/planets/planets.service';
import { SpeciesService } from 'src/species/species.service';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { StarshipsService } from 'src/starships/starship.service';


@Injectable()
@UseInterceptors(FileUrlTransformInterceptor)
export class PeopleService {
    constructor(
        @InjectRepository(Person)
        private peopleRepository: Repository<Person>,
        private readonly imagesService: ImagesService,
        private readonly planetsService: PlanetsService,
        private readonly speciesService: SpeciesService,
        private readonly vehiclesService: VehiclesService,
        private readonly starshipsService: StarshipsService
    ) { }

    async findOne(id: number) {
        const person = await this.findPerson(id);

        return person;
    }

    public async createPerson(personData: CreatePeopleDto, files: Array<Express.Multer.File>) {
        const images = await this.imagesService.saveImages(files);

        const homeworld = await this.planetsService.getHomeword(personData.homeworld);
        const specie = await this.speciesService.findSpecie(personData.specie);
        const starships = await this.starshipsService.getStarshipsByIds(personData.starships);
        const vehicles = await this.vehiclesService.getVehiclesByIds(personData.vehicles);


        if (!homeworld)
            throw new NotFoundException(`Homeword #${personData.homeworld} not found`);


        const person = this.peopleRepository.create({
            ...personData,
            homeworld: Promise.resolve(homeworld),
            specie: Promise.resolve(specie),
            images: Promise.resolve(images),
            starships: Promise.resolve(starships),
            vehicles: Promise.resolve(vehicles)
        });

        const createdPerson = await this.peopleRepository.save(person);

        await this.planetsService.addNewResident(homeworld, createdPerson);

        return createdPerson;
    }

    public async findPeople(skip: number, take: number) {
        const people = await this.peopleRepository.find({
            skip: skip,
            take: take,
            relations: ['homeworld', 'specie', 'starships', 'vehicles', 'images']
        });

        return people;
    }

    public findPerson(id: number) {
        return this.peopleRepository.findOne({
            where: {
                id: id
            },
            relations: ['homeworld', 'specie', 'starships', 'vehicles', 'images']
        });
    }

    public async updatePerson(id: number, updatePersonData: UpdatePeopleDto) {

        const { homeworld, specie, starships, vehicles, ...personRestData } = updatePersonData;

        const person: Person = await this.peopleRepository.findOne(
            {
                where: { id: id },
                relations: ['homeworld', 'specie', 'starships', 'vehicles', 'images']
            }
        );

        if (!person)
            throw new NotFoundException(`Person #${id} not found`);

        Object.assign(person, personRestData);

        if (homeworld) {
            const homeworldFromDb = await person.homeworld;

            if (homeworldFromDb) {
                const personHomeworldId = homeworldFromDb.id

                if (homeworld != personHomeworldId)
                    person.homeworld = this.planetsService.findOnePlanet(homeworld);
            } else {
                person.homeworld = this.planetsService.findOnePlanet(homeworld);
            }
        }

        if (specie) {
            const specieFromDb = await person.specie;

            if (specieFromDb) {
                const specieHomeworldId = specieFromDb.id

                if (specie != specieHomeworldId)
                    person.specie = this.speciesService.findSpecie(specie);
            } else {
                person.specie = this.speciesService.findSpecie(specie);
            }
        }

        if (starships) {
            const personStarships = (await person.starships).map(starship => starship.id);
            if (!this.compareArrays(starships, personStarships)) {
                person.starships = this.starshipsService.getStarshipsByIds(starships)
            }
        }

        if (vehicles) {
            const personVehicles = (await person.vehicles).map(vehicle => vehicle.id);
            if (!this.compareArrays(vehicles, personVehicles)) {
                person.vehicles = this.vehiclesService.getVehiclesByIds(vehicles)
            }
        }

        return await this.peopleRepository.save(person)
    }

    public async deletePerson(id: number) {
        const person = await this.peopleRepository.findOne({ where: { id: id } });

        if (!person)
            throw new NotFoundException(`Person #${id} not found`);

        return await this.peopleRepository.remove(person);
    }

    public async getPeopleByIds(ids: number[]) {
        const people = await this.peopleRepository.findBy({
            id: In(ids)
        })
        if (!people) {
            throw new NotFoundException(`People not found`);
        }
        return people;
    }

    private compareArrays<T>(arr1: T[], arr2: T[]) {
        if (arr1.length !== arr2.length)
            return false;

        const sortedArr1 = arr1.slice().sort();
        const sortedArr2 = arr2.slice().sort();

        for (let i = 0; i < sortedArr1.length; i++) {
            if (sortedArr1[i] !== sortedArr2[i])
                return false;
        }

        return true;
    }
}
