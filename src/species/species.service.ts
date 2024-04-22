import { InjectRepository } from "@nestjs/typeorm";
import { CreateSpeciesDto, UpdateSpeciesDto } from "./species.dto";
import { Species } from "./species.entity";
import { Repository } from "typeorm";
import { ImagesService } from "src/images/images.service";
import { PlanetsService } from "src/planets/planets.service";
import { NotFoundException } from "@nestjs/common";

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
        const homeworld = await this.planetsService.findOnePlanet(specieData.homeworld);

        if (!homeworld)
            throw new NotFoundException(`Homeword #${specieData.homeworld} not found`);

        const specie = this.speciesRepository.create({
            ...specieData,
            homeworld: Promise.resolve(homeworld),
            images: images
        });

        return await this.speciesRepository.save(specie);

    }

    findSpecie(id: number) {
        return this.speciesRepository.findOne({
            where: {
                id: id
            },
            relations: ['images', 'people']
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

        const homeworld = await this.planetsService.getHomeword(updateSpecieData.homeworld);

        const updateSpecie = {
            id: id,
            ...updateSpecieData,
            homeworld: Promise.resolve(homeworld)
        }

        const updatedSpecie = await this.speciesRepository.preload(updateSpecie)

        return await this.speciesRepository.save(updatedSpecie); 44

    }

    async deleteSpecie(id: number) {
        const specie = await this.speciesRepository.findOne({ where: { id: id } });

        if (!specie)
            throw new NotFoundException(`Specie #${id} not found`);

        return await this.speciesRepository.remove(specie);
    }

}