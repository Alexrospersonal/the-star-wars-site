import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { SpeciesService } from "./species.service";
import { PaginationType } from "src/people/people.pagination";
import { ImageFileValidationPipe } from "src/files.validators";
import { SpeciesInterceptor } from "src/images/images.interceptor";
import { CreateSpeciesDto, UpdateSpeciesDto } from "./species.dto";

@Controller('species')
export class SpeciesController {
    constructor(
        private readonly speciesService: SpeciesService
    ) { }

    @Post()
    @UseInterceptors(SpeciesInterceptor)
    public async create(
        @Body() specie: CreateSpeciesDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {
        const res = await this.speciesService.createSpecie(specie, files);
        return await res.toResponseObject();
    }

    @Get(':id')
    public async findOne(@Param('id', ParseIntPipe) id: number) {
        const specie = await this.speciesService.findSpecie(id);
        return await specie.toResponseObject()
    }

    @Get()
    public findAll(@Query() query: PaginationType) {
        const skip = query.skip ? +query.skip : 0
        return this.speciesService.findSpecies(skip, 10);
    }

    @Patch(':id')
    public async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSpecies: UpdateSpeciesDto
    ) {
        return await this.speciesService.updateSpecie(id, updateSpecies);
    }

    @Delete(':id')
    public async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.speciesService.deleteSpecie(id);
    }
}