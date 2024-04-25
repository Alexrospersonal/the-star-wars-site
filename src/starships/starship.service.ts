import { In, Repository } from "typeorm";
import { CreateStarshipDto, UpdateStarshipDto } from "./starship.dto";
import { Starships } from "./starship.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ImagesService } from "src/images/images.service";
import { Injectable, NotFoundException, UseInterceptors } from "@nestjs/common";
import { PeopleService } from "src/people/people.service";
import { FileUrlTransformInterceptor } from "src/interceptors/fileUrlTransform.interceptor";

@Injectable()
@UseInterceptors(FileUrlTransformInterceptor)
export class StarshipsService {

    constructor(
        @InjectRepository(Starships)
        private readonly starshipRepository: Repository<Starships>,
        private readonly imagesService: ImagesService,
    ) { }

    async createStarship(starshipData: CreateStarshipDto, files: Express.Multer.File[]) {
        const images = await this.imagesService.saveImages(files);

        const starship = this.starshipRepository.create({
            ...starshipData,
            images: images
        });

        return await this.starshipRepository.save(starship);
    }

    findStarship(id: number) {
        return this.starshipRepository.findOne({
            where: {
                id: id
            },
            relations: ['images', 'pilots']
        });
    }

    findStarships(skip: number, take: number) {
        return this.starshipRepository.find({
            skip: skip,
            take: take,
            relations: ['images', 'pilots']
        });
    }

    async updateStarship(id: number, updateStarshipData: UpdateStarshipDto) {

        const updateStarship = {
            id: id,
            ...updateStarshipData,
        }

        const updatedStarship = await this.starshipRepository.preload(updateStarship)

        if (!updatedStarship)
            throw new NotFoundException(`Starship #${id} not found`);

        return await this.starshipRepository.save(updatedStarship); 44
    }

    async deleteStarship(id: number) {
        const starship = await this.starshipRepository.findOne({ where: { id: id } });

        if (!starship)
            throw new NotFoundException(`Starship #${id} not found`);

        return await this.starshipRepository.remove(starship);
    }

    public async getStarshipsByIds(ids: number[]) {
        const starships = await this.starshipRepository.findBy({
            id: In(ids)
        })
        if (!starships) {
            throw new NotFoundException(`People not found`);
        }
        return starships;
    }
}