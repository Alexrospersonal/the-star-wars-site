import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { CreatePlanetDto, UpdatePlanetDto } from "./planets.dto";
import { ImageFileValidationPipe } from "src/files.validators";
import { PaginationType } from "src/people/people.pagination";
import { PlanetsService } from "./planets.service";
import { PlanetImageStorageInterceptor } from "src/images/images.interceptor";
import { PlanetInterceptor } from "./planets.interceptor";

@Controller('planets')
export class PlanetsController {
    constructor(
        private readonly planetsService: PlanetsService
    ) { }

    @Post()
    @UseInterceptors(PlanetImageStorageInterceptor)
    async create(
        @Body() createPlanet: CreatePlanetDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {
        return await (await this.planetsService.createPlanet(createPlanet, files)).toResponseObject();
    }

    @Get()
    @UseInterceptors(PlanetInterceptor)
    async findAll(@Query() query: PaginationType) {
        const skip = query.skip ? +query.skip : 0;
        const planets = await this.planetsService.findAllPlanet(skip, 10);
        return Promise.all(planets.map(async (planet) => await planet.toResponseObject()))
    }

    @Get(':id')
    @UseInterceptors(PlanetInterceptor)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await (await this.planetsService.getOnePlanet(id)).toResponseObject();
    }

    @Patch(':id')
    @UseInterceptors(PlanetInterceptor)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePlanet: UpdatePlanetDto
    ) {
        return await (await this.planetsService.updatePlanet(id, updatePlanet)).toResponseObject();
    }

    @Delete(':id')
    @UseInterceptors(PlanetInterceptor)
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await (await this.planetsService.deletePlanet(id)).toResponseObject();
    }
}