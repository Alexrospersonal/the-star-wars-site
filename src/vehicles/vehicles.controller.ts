import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { VehiclesService } from "./vehicles.service";
import { VehiclessImageStorageInterceptor } from "src/images/images.interceptor";
import { ImageFileValidationPipe } from "src/files.validators";
import { CreateVehicleDto, UpdateVehicleDto } from "./vehicles.dto";
import { PaginationType } from "src/people/people.pagination";
import { VehiclesInterceptor } from "./vehicles.interceptor";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Vehicles } from "./vehicles.entity";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller('vehicles')
@ApiTags('vehicles')
export class vehiclesController {
    constructor(
        private readonly vehiclesService: VehiclesService
    ) { }

    @Post()
    // @UseInterceptors(VehiclessImageStorageInterceptor)
    @UseInterceptors(FilesInterceptor('files'))
    @UseInterceptors(VehiclesInterceptor)
    @ApiResponse({ status: 200, description: 'Created', type: Vehicles })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async create(
        @Body() vehicleData: CreateVehicleDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {
        try {
            const vehicle = await this.vehiclesService.createVehicle(vehicleData, files);
            return await vehicle.toResponseObject()
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @UseInterceptors(VehiclesInterceptor)
    @ApiResponse({ status: 200, description: 'OK', type: Vehicles })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async findOne(@Param('id', ParseIntPipe) id: number) {
        try {
            const vehicle = await this.vehiclesService.findVehicle(id);
            return await vehicle.toResponseObject()
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    @UseInterceptors(VehiclesInterceptor)
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'OK', type: Vehicles })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async findAll(@Query() query: PaginationType) {
        const skip = query.skip ? +query.skip : 0

        try {
            const vehicles = await this.vehiclesService.findVehicles(skip, 10);
            return Promise.all(vehicles.map(async vehicle => await vehicle.toResponseObject()))
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch(':id')
    @UseInterceptors(VehiclesInterceptor)
    @ApiResponse({ status: 200, description: 'Updated', type: Vehicles })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateVehicle: UpdateVehicleDto
    ) {
        try {
            const vehicle = await this.vehiclesService.updateVehicle(id, updateVehicle);
            return await vehicle.toResponseObject()
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @UseInterceptors(VehiclesInterceptor)
    @ApiResponse({ status: 200, description: 'Deleted', type: Vehicles })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            const vehicle = await this.vehiclesService.deleteVehicle(id);
            return await vehicle.toResponseObject()
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}