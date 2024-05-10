import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { CreatePlanetDto, UpdatePlanetDto } from "./planets.dto";
import { ImageFileValidationPipe } from "src/files.validators";
import { PaginationType } from "src/people/people.pagination";
import { PlanetsService } from "./planets.service";
import { ImageRenameInterceptor, PlanetImageStorageInterceptor } from "src/images/images.interceptor";
import { PlanetInterceptor } from "./planets.interceptor";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Person } from "src/people/entities/people.entity";
import { Planet } from "./planets.entity";
import { Roles } from 'src/auth/auth.decorators';
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller('planets')
@ApiTags('planets')
export class PlanetsController {
    constructor(
        private readonly planetsService: PlanetsService
    ) { }

    @Post()
    @Roles(['admin'])
    // @UseInterceptors(PlanetImageStorageInterceptor)
    @UseInterceptors(ImageRenameInterceptor)
    @UseInterceptors(PlanetInterceptor)
    @ApiResponse({ status: 200, description: 'Created', type: Planet })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async create(
        @Body() createPlanet: CreatePlanetDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {
        try {
            return await (await this.planetsService.createPlanet(createPlanet, files)).toResponseObject();
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    @Roles(['admin', 'user'])
    @UseInterceptors(PlanetInterceptor)
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'OK', type: Planet })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async findAll(@Query() query: PaginationType) {
        const skip = query.skip ? +query.skip : 0;

        try {
            const planets = await this.planetsService.findAllPlanet(skip, 10);
            return Promise.all(planets.map(async (planet) => await planet.toResponseObject()))
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @Roles(['admin', 'user'])
    @UseInterceptors(PlanetInterceptor)
    @ApiResponse({ status: 200, description: 'OK', type: Planet })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        try {
            return await (await this.planetsService.getOnePlanet(id)).toResponseObject();
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch(':id')
    @Roles(['admin'])
    @UseInterceptors(PlanetInterceptor)
    @ApiResponse({ status: 200, description: 'Updated', type: Planet })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePlanet: UpdatePlanetDto
    ) {
        try {
            return await (await this.planetsService.updatePlanet(id, updatePlanet)).toResponseObject();
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @Roles(['admin'])
    @UseInterceptors(PlanetInterceptor)
    @ApiResponse({ status: 200, description: 'Deleted', type: Planet })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            return await (await this.planetsService.deletePlanet(id)).toResponseObject();
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}