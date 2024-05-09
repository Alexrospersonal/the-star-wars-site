import { Injectable, NotFoundException, UseInterceptors } from "@nestjs/common";
import { ImagesService } from "src/images/images.service";
import { FileUrlTransformInterceptor } from "src/interceptors/fileUrlTransform.interceptor";
import { CreatePlanetDto, UpdatePlanetDto } from "./planets.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Planet } from "./planets.entity";
import { In, Repository } from "typeorm";
import { Person } from "src/people/entities/people.entity";
import { Species } from "src/species/species.entity";
import { Films } from "src/films/films.entity";
import { FilmContainer } from "src/films/films.interface";


@Injectable()
@UseInterceptors(FileUrlTransformInterceptor)
export class PlanetsService implements FilmContainer<Planet> {
    constructor(
        private readonly imagesService: ImagesService,
        @InjectRepository(Planet)
        private planetRepository: Repository<Planet>,
    ) { }

    async getOnePlanet(id: number) {
        const planet = await this.findOnePlanet(id);

        if (!planet) {
            throw new NotFoundException(`Planet #${id} not found`);
        }

        return planet;
    }

    public async createPlanet(planetData: CreatePlanetDto, files: Array<Express.Multer.File>) {
        const images = await this.imagesService.uploadImages(files, 'planets');

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
            images: images
        });

        return await this.planetRepository.save(planet);
    }

    public async findOnePlanet(id: number) {
        const planet = await this.planetRepository.findOne(
            {
                where: { id: id },
                relations: ['residents', 'images', 'films']
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
            relations: ['residents', 'images', 'films']
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
        const planet = await this.findOnePlanet(id);

        if (!planet) {
            throw new NotFoundException(`Planet #${id} not found`);
        }

        for (const image of planet.images) {
            await this.imagesService.deleteUploadedImage(image.id)
        }

        return await this.planetRepository.remove(planet);
    }

    public async addNewResident(planet: Planet, resident: Person) {
        const residents = await planet.residents;
        residents.push(resident);

        planet.residents = Promise.resolve(residents);
        return await this.planetRepository.save(planet);
    }

    public async addNewSpecie(homeworld: Planet, specie: Species) {
        const species = await homeworld.species;
        species.push(specie);

        homeworld.species = Promise.resolve(species);
        return await this.planetRepository.save(homeworld);
    }

    public async getPlanetByIds(ids: number[]) {
        const planets = await this.planetRepository.find({
            where: {
                id: In(ids)
            },
            relations: ['residents', 'images', 'films']
        })
        if (!planets) {
            throw new NotFoundException(`PLanets not found`);
        }
        return planets;
    }

    public async addNewFilmToEntity(entity: Planet, film: Films) {
        const films = entity.films;
        films.push(film);

        entity.films = films;
        return await this.planetRepository.save(entity);
    }

}