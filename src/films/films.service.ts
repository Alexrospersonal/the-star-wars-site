import { Injectable, NotFoundException, UseInterceptors } from "@nestjs/common";
import { FileUrlTransformInteceptor } from "src/interceptors/fileUrlTransform.interceptor";
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

@Injectable()
@UseInterceptors(FileUrlTransformInteceptor)
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
    ) {

    }

    async createFilm(filmsData: CreateFilmDto, files: Express.Multer.File[]) {
        const images = await this.imagesService.saveImages(files);

        const characters = await this.peopleService.getPeopleByIds(filmsData.characters);
        const planets = await this.planetsService.getPlanetByIds(filmsData.planets);
        const species = await this.speciesService.getSpesiesByIds(filmsData.species);
        const starships = await this.starshipsService.getStarshipsByIds(filmsData.starships);
        const vehicles = await this.vehiclesService.getVehiclesByIds(filmsData.vehicles);


        const film = this.filmsRepository.create({
            ...filmsData,
            characters: Promise.resolve(characters),
            planets: Promise.resolve(planets),
            species: Promise.resolve(species),
            starships: Promise.resolve(starships),
            vehicles: Promise.resolve(vehicles),
            images: images
        });

        return await this.filmsRepository.save(film);
    }

    findFilm(id: number) {
        return this.filmsRepository.findOne({
            where: {
                id: id
            },
            relations: ['images', 'characters', 'planets', 'species', 'starships', 'vehicles']
        })
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
            characters: Promise.resolve(characters),
            planets: Promise.resolve(planets),
            species: Promise.resolve(species),
            starships: Promise.resolve(starships),
            vehicles: Promise.resolve(vehicles),
        }

        const updatedFilm = await this.filmsRepository.preload(filmData)

        return await this.filmsRepository.save(updatedFilm);
    }

    async deleteFilm(id: number) {
        const film = await this.filmsRepository.findOne({ where: { id: id } });

        if (!film)
            throw new NotFoundException(`Specie #${id} not found`);

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
            throw new NotFoundException(`People not found`);
        }
        return specie;
    }

}