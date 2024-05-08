import { Injectable, NotFoundException, UseInterceptors } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileUrlTransformInterceptor } from "src/interceptors/fileUrlTransform.interceptor";
import { Vehicles } from "./vehicles.entity";
import { In, Repository } from "typeorm";
import { ImagesService } from "src/images/images.service";
import { CreateVehicleDto, UpdateVehicleDto } from "./vehicles.dto";
import { Films } from "src/films/films.entity";
import { FilmContainer } from "src/films/films.interface";
import { Person } from "src/people/entities/people.entity";

@Injectable()
@UseInterceptors(FileUrlTransformInterceptor)
export class VehiclesService implements FilmContainer<Vehicles> {

    constructor(
        @InjectRepository(Vehicles)
        private readonly vehiclesRepository: Repository<Vehicles>,
        private readonly imagesService: ImagesService,
    ) { }

    async createVehicle(vehicleData: CreateVehicleDto, files: Express.Multer.File[]) {
        const images = await this.imagesService.saveImages(files, 'vehicles');

        const vehicle = this.vehiclesRepository.create({
            ...vehicleData,
            images: images
        });

        return await this.vehiclesRepository.save(vehicle);
    }

    async findVehicle(id: number) {
        const vehicle = await this.vehiclesRepository.findOne({
            where: {
                id: id
            },
            relations: ['images', 'pilots', 'films']
        });

        if (!vehicle)
            throw new NotFoundException(`Vehicle #${id} not found`);

        return vehicle;
    }

    findVehicles(skip: number, take: number) {
        return this.vehiclesRepository.find({
            skip: skip,
            take: take,
            relations: ['images', 'pilots', 'films']
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
        const vehicle = await this.findVehicle(id);

        if (!vehicle)
            throw new NotFoundException(`Vehicle #${id} not found`);

        for (const image of vehicle.images) {
            await this.imagesService.deleteUploadedImage(image.id)
        }

        return await this.vehiclesRepository.remove(vehicle);
    }

    public async getVehiclesByIds(ids: number[]) {
        const vehicles = await this.vehiclesRepository.find({
            where: {
                id: In(ids)
            },
            relations: ['images', 'pilots', 'films']
        })
        if (!vehicles) {
            throw new NotFoundException(`Vehicles not found`);
        }
        return vehicles;
    }

    public async addNewFilmToEntity(entity: Vehicles, film: Films) {
        const films = entity.films;
        films.push(film);

        entity.films = films;
        return await this.vehiclesRepository.save(entity);
    }

    public async addNewPilots(pilot: Person, vehicles: Vehicles[]) {
        for (const vehicle of vehicles) {
            const pilots = vehicle.pilots;
            pilots.push(pilot);

            vehicle.pilots = pilots;
            await this.vehiclesRepository.save(vehicle);
        }
    }
}