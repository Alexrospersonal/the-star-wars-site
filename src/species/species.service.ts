import { InjectRepository } from "@nestjs/typeorm";
import { CreateSpeciesDto, UpdateSpeciesDto } from "./species.dto";
import { Species } from "./species.entity";
import { In, Repository } from "typeorm";
import { ImagesService } from "src/images/images.service";
import { PlanetsService } from "src/planets/planets.service";
import { Injectable, NotFoundException, UseInterceptors } from "@nestjs/common";
import { FileUrlTransformInterceptor } from "src/interceptors/fileUrlTransform.interceptor";
import { Person } from "src/people/entities/people.entity";
import { Planet } from "src/planets/planets.entity";

@Injectable()
@UseInterceptors(FileUrlTransformInterceptor)
export class SpeciesService {
    constructor(
        @InjectRepository(Species)
        private readonly speciesRepository: Repository<Species>,
        private readonly imagesService: ImagesService,
        private readonly planetsService: PlanetsService
    ) {

    }

    async createSpecie(specieData: CreateSpeciesDto, files: Express.Multer.File[]) {
        const images = await this.imagesService.saveImages(files);

        let homeworld: Planet;

        if (specieData.homeworld > 0)
            homeworld = await this.planetsService.findOnePlanet(specieData.homeworld);
        else
            homeworld = null

        const specie = this.speciesRepository.create({
            ...specieData,
            homeworld: Promise.resolve(homeworld),
            images: images
        });


        const newSpecie = await this.speciesRepository.save(specie);


        if (homeworld) {
            await this.planetsService.addNewSpecie(homeworld, newSpecie);
        }

        return newSpecie
    }

    findSpecie(id: number) {
        return this.speciesRepository.findOne({
            where: {
                id: id
            },
            relations: ['images', 'homeworld', 'people']
        })
    }

    findSpecies(skip: number, take: number) {
        return this.speciesRepository.find({
            skip: skip,
            take: take,
            relations: ['images', 'homeworld', 'people']
        });
    }

    async updateSpecie(id: number, updateSpecieData: UpdateSpeciesDto) {

        // const homeworld = await this.planetsService.getHomeword(updateSpecieData.homeworld);
        const homeworld = await this.planetsService.getOnePlanet(updateSpecieData.homeworld);

        const updateSpecie = {
            id: id,
            ...updateSpecieData,
            homeworld: Promise.resolve(homeworld)
        }

        const updatedSpecie = await this.speciesRepository.preload(updateSpecie)

        return await this.speciesRepository.save(updatedSpecie);

    }

    async deleteSpecie(id: number) {
        const specie = await this.speciesRepository.findOne({ where: { id: id } });

        if (!specie)
            throw new NotFoundException(`Specie #${id} not found`);

        return await this.speciesRepository.remove(specie);
    }

    public async getSpesiesByIds(ids: number[]) {
        const specie = await this.speciesRepository.findBy({
            id: In(ids)
        })
        if (!specie) {
            throw new NotFoundException(`People not found`);
        }
        return specie;
    }

    async addNewPerson(specie: Species, person: Person) {
        const residents = await specie.people;
        residents.push(person);

        specie.people = Promise.resolve(residents);
        return await this.speciesRepository.save(specie);
    }
}