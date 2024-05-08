import { Injectable, NotFoundException, UseInterceptors } from "@nestjs/common";
import { FileUrlTransformInterceptor } from "src/interceptors/fileUrlTransform.interceptor";
import { In, Repository } from "typeorm";
import { Films } from "./films.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ImagesService } from "src/images/images.service";
import { PeopleService } from "src/people/people.service";
import { PlanetsService } from "src/planets/planets.service";
import { SpeciesService } from "src/species/species.service";
import { StarshipsService } from "src/starships/starship.service";
import { VehiclesService } from "src/vehicles/vehicles.service";
import { CreateFilmDto, UpdateFilmDto } from "./films.dto";
import { Person } from "src/people/entities/people.entity";
import { FilmContainer } from "./films.interface";
import { Planet } from "src/planets/planets.entity";
import { Species } from "src/species/species.entity";
import { Starships } from "src/starships/starship.entity";
import { Vehicles } from "src/vehicles/vehicles.entity";

@Injectable()
@UseInterceptors(FileUrlTransformInterceptor)
export class FilmsService {

    constructor(
        @InjectRepository(Films)
        private readonly filmsRepository: Repository<Films>,
        private readonly imagesService: ImagesService,
        private readonly peopleService: PeopleService,
        private readonly planetsService: PlanetsService,
        private readonly speciesService: SpeciesService,
        private readonly starshipsService: StarshipsService,
        private readonly vehiclesService: VehiclesService,
    ) { }

    async createFilm(filmsData: CreateFilmDto, files: Express.Multer.File[]) {
        const images = await this.imagesService.saveImages(files, 'films');

        const characters = await this.peopleService.getPeopleByIds(filmsData.characters);
        const planets = await this.planetsService.getPlanetByIds(filmsData.planets);
        const species = await this.speciesService.getSpesiesByIds(filmsData.species);
        const starships = await this.starshipsService.getStarshipsByIds(filmsData.starships);
        const vehicles = await this.vehiclesService.getVehiclesByIds(filmsData.vehicles);

        const film = this.filmsRepository.create({
            ...filmsData,
            characters: characters,
            planets: planets,
            species: species,
            starships: starships,
            vehicles: vehicles,
            images: images
        });

        const createdFilm = await this.filmsRepository.save(film);

        await this.addFilmToEntyties<Person, PeopleService>(characters, createdFilm, this.peopleService);
        await this.addFilmToEntyties<Planet, PlanetsService>(planets, createdFilm, this.planetsService);
        await this.addFilmToEntyties<Species, SpeciesService>(species, createdFilm, this.speciesService);
        await this.addFilmToEntyties<Starships, StarshipsService>(starships, createdFilm, this.starshipsService);
        await this.addFilmToEntyties<Vehicles, VehiclesService>(vehicles, createdFilm, this.vehiclesService);

        return createdFilm;
    }

    async addFilmToEntyties<T, U extends FilmContainer<T>>(entities: T[], film: Films, repository: U) {
        for (const entity of entities) {
            await repository.addNewFilmToEntity(entity, film)
        }
    }

    async findFilm(id: number) {
        const film = await this.filmsRepository.findOne({
            where: {
                id: id
            },
            relations: ['images', 'characters', 'planets', 'species', 'starships', 'vehicles']
        })

        if (!film)
            throw new NotFoundException(`Film #${id} not found`)

        return film
    }

    findFilms(skip: number, take: number) {
        return this.filmsRepository.find({
            skip: skip,
            take: take,
            relations: ['images', 'characters', 'planets', 'species', 'starships', 'vehicles']
        });
    }

    async updateFilm(id: number, updateFilm: UpdateFilmDto) {
        const characters = await this.peopleService.getPeopleByIds(updateFilm.characters);
        const planets = await this.planetsService.getPlanetByIds(updateFilm.planets);
        const species = await this.speciesService.getSpesiesByIds(updateFilm.species);
        const starships = await this.starshipsService.getStarshipsByIds(updateFilm.starships);
        const vehicles = await this.vehiclesService.getVehiclesByIds(updateFilm.vehicles);

        const filmData = {
            ...UpdateFilmDto,
            characters: characters,
            planets: planets,
            species: species,
            starships: starships,
            vehicles: vehicles,
        }

        const updatedFilm = await this.filmsRepository.preload(filmData);

        if (!updateFilm)
            throw new NotFoundException(`Film #${id} not found`)

        return await this.filmsRepository.save(updatedFilm);
    }

    async deleteFilm(id: number) {
        const film = await this.findFilm(id);

        if (!film)
            throw new NotFoundException(`Film #${id} not found`);

        for (const image of film.images) {
            await this.imagesService.deleteUploadedImage(image.id)
        }

        return await this.filmsRepository.remove(film);
    }

    public async getFilmsByIds(ids: number[]) {
        const specie = await this.filmsRepository.find({
            where: {
                id: In(ids),
            },
            relations: ['images', 'characters', 'planets', 'species', 'starships', 'vehicles']
        });

        if (!specie) {
            throw new NotFoundException(`Films #${ids} not found`);
        }
        return specie;
    }

}