import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { CreatePlanetDto, UpdatePlanetDto } from "./planets.dto";
import { ImageFileValidationPipe } from "src/files.validators";
import { PaginationType } from "src/people/people.pagination";
import { PlanetsService } from "./planets.service";
import { PlanetInterceptor } from "src/images/images.interceptor";

@Controller('planets')
export class PlanetsController {
    constructor(
        private readonly planetsService: PlanetsService
    ) { }

    @Post()
    @UseInterceptors(PlanetInterceptor)
    async create(
        @Body() createPlanet: CreatePlanetDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {
        // TODO: Call creating function from DB
        return await this.planetsService.createPlanet(createPlanet, files);
    }

    @Get()
    findAll(@Query() query: PaginationType) {
        // TODO: Gat first 10 planets from DB, use pagination
        const skip = query.skip ? +query.skip : 0;
        return this.planetsService.findAllPlanet(skip, 10)
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        // TODO: Get one planet from DB
        return await this.planetsService.getOnePlanet(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePlanet: UpdatePlanetDto
    ) {
        // TODO: call updating function from DB
        return await this.planetsService.updatePlanet(id, updatePlanet);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        // TODO: call deleting function from DB
        return await this.planetsService.deletePlanet(id);
    }
}