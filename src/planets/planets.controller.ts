import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { DataBaseService } from "src/database/database.service";
import { CreatePlanetDto, UpdatePlanetDto } from "./planets.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { UpdatePeopleDto } from "src/people/people.dto";
import { ImageFileValidationPipe } from "src/files.validators";
import { PaginationType } from "src/people/people.pagination";
import { PlanetsService } from "./planets.service";
import { PlanetInterceptor } from "src/images/images.interceptor";

@Controller('planets')
export class PlanetsController {
    constructor(
        private readonly dataBaseService: DataBaseService,
        private readonly planetsService: PlanetsService
    ) { }

    @Post()
    @UseInterceptors(PlanetInterceptor)
    async create(
        @Body() createPlanet: CreatePlanetDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {
        // TODO: Call creating function from DB
        return await this.dataBaseService.createPlanet(createPlanet, files);
    }

    @Get()
    findAll(@Query() query: PaginationType) {
        // TODO: Gat first 10 planets from DB, use pagination
        const skip = query.skip ? +query.skip : 0;
        return this.dataBaseService.findAllPlanet(skip, 10)
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
        return await this.dataBaseService.updatePlanet(id, updatePlanet);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        // TODO: call deleting function from DB
        return await this.dataBaseService.deletePlanet(id);
    }
}