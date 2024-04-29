import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { VehiclesService } from "./vehicles.service";
import { VehiclessImageStorageInterceptor } from "src/images/images.interceptor";
import { ImageFileValidationPipe } from "src/files.validators";
import { CreateVehicleDto, UpdateVehicleDto } from "./vehicles.dto";
import { PaginationType } from "src/people/people.pagination";
import { VehiclesInterceptor } from "./vehicles.interceptor";

@Controller('vehicles')
export class vehiclesController {
    constructor(
        private readonly vehiclesService: VehiclesService
    ) { }

    @Post()
    @UseInterceptors(VehiclessImageStorageInterceptor)
    @UseInterceptors(VehiclesInterceptor)
    public async create(
        @Body() vehicleData: CreateVehicleDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {
        const vehicle = await this.vehiclesService.createVehicle(vehicleData, files);
        return await vehicle.toResponseObject()
    }

    @Get(':id')
    @UseInterceptors(VehiclesInterceptor)
    public async findOne(@Param('id', ParseIntPipe) id: number) {
        const vehicle = await this.vehiclesService.findVehicle(id);
        return await vehicle.toResponseObject()
    }

    @Get()
    @UseInterceptors(VehiclesInterceptor)
    public async findAll(@Query() query: PaginationType) {
        const skip = query.skip ? +query.skip : 0
        const vehicles = await this.vehiclesService.findVehicles(skip, 10);
        return Promise.all(vehicles.map(async vehicle => await vehicle.toResponseObject()))
    }

    @Patch(':id')
    @UseInterceptors(VehiclesInterceptor)
    public async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateVehicle: UpdateVehicleDto
    ) {
        const vehicle = await this.vehiclesService.updateVehicle(id, updateVehicle);
        return await vehicle.toResponseObject()
    }

    @Delete(':id')
    @UseInterceptors(VehiclesInterceptor)
    public async delete(@Param('id', ParseIntPipe) id: number) {
        const vehicle = await this.vehiclesService.deleteVehicle(id);
        return await vehicle.toResponseObject()
    }
}