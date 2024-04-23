import { Injectable, NotFoundException, UseInterceptors } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileUrlTransformInteceptor } from "src/interceptors/fileUrlTransform.interceptor";
import { Vehicles } from "./vehicles.entity";
import { In, Repository } from "typeorm";
import { ImagesService } from "src/images/images.service";
import { CreateVehicleDto, UpdateVehicleDto } from "./vehicles.dto";

@Injectable()
@UseInterceptors(FileUrlTransformInteceptor)
export class VehiclesService {

    constructor(
        @InjectRepository(Vehicles)
        private readonly vehiclesRepository: Repository<Vehicles>,
        private readonly imagesService: ImagesService,
    ) { }

    async createVehicle(vehicleData: CreateVehicleDto, files: Express.Multer.File[]) {
        const images = await this.imagesService.saveImages(files);

        const vehicle = this.vehiclesRepository.create({
            ...vehicleData,
            images: images
        });

        return await this.vehiclesRepository.save(vehicle);
    }

    findVehicle(id: number) {
        return this.vehiclesRepository.findOne({
            where: {
                id: id
            },
            relations: ['images', 'pilots']
        });
    }

    findVehicles(skip: number, take: number) {
        return this.vehiclesRepository.find({
            skip: skip,
            take: take,
            relations: ['images', 'pilots']
        });
    }

    async updateVehicle(id: number, updateVehicleData: UpdateVehicleDto) {

        const updateStarship = {
            id: id,
            ...updateVehicleData,
        }

        const updatedVehicle = await this.vehiclesRepository.preload(updateStarship)

        if (!updatedVehicle)
            throw new NotFoundException(`Vehicle #${id} not found`);

        return await this.vehiclesRepository.save(updatedVehicle); 44
    }

    async deleteVehicle(id: number) {
        const vehicle = await this.vehiclesRepository.findOne({ where: { id: id } });

        if (!vehicle)
            throw new NotFoundException(`Vehicle #${id} not found`);

        return await this.vehiclesRepository.remove(vehicle);
    }

    public async getVehiclesByIds(ids: number[]) {
        const vehicles = await this.vehiclesRepository.findBy({
            id: In(ids)
        })
        if (!vehicles) {
            throw new NotFoundException(`People not found`);
        }
        return vehicles;
    }
}