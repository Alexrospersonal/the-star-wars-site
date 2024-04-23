import { Injectable, NotFoundException, UseInterceptors } from "@nestjs/common";
import { ImagesService } from "src/images/images.service";
import { FileUrlTransformInteceptor } from "src/interceptors/fileUrlTransform.interceptor";
import { CreatePlanetDto, UpdatePlanetDto } from "./planets.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Planet } from "./planets.entity";
import { In, Repository } from "typeorm";
import { Person } from "src/people/entities/people.entity";


@Injectable()
@UseInterceptors(FileUrlTransformInteceptor)
export class PlanetsService {
    constructor(
        private readonly imagesService: ImagesService,
        @InjectRepository(Planet)
        private planetRepository: Repository<Planet>,
    ) { }

    async getOnePlanet(id: number) {
        const planet = await this.findOnePlanet(id);

        return planet;
    }

    public async createPlanet(planetData: CreatePlanetDto, files: Array<Express.Multer.File>) {
        const images = await this.imagesService.saveImages(files);

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
            residents: Promise.resolve([]),
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
        return this.planetRepository.find({
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

        // const residents = planet.residents.map(person => {
        //     person.homeworld = null;
        //     return person;
        // });

        // this.peopleRepository.save(residents);

        return await this.planetRepository.remove(planet);
    }

    public async getHomeword(id: number) {
        return await this.planetRepository.findOne({
            where: {
                id: id
            },
            relations: ['residents']
        });
    }

    public async addNewResident(planet: Planet, resident: Person) {
        const residents = await planet.residents;
        residents.push(resident);

        planet.residents = Promise.resolve(residents);
        await this.planetRepository.save(planet);
    }

    public async removeResident(planet: Planet, resident: Person) {
        const residents = await planet.residents;
        planet.residents = Promise.resolve(
            residents.filter((person, idx, arr) => {
                person !== resident
            })
        )
        await this.planetRepository.save(planet);
    }

    public async getPlanetByIds(ids: number[]) {
        const people = await this.planetRepository.findBy({
            id: In(ids)
        })
        if (!people) {
            throw new NotFoundException(`People not found`);
        }
        return people;
    }
}