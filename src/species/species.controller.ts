import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { SpeciesService } from "./species.service";
import { PaginationType } from "src/people/people.pagination";
import { ImageFileValidationPipe } from "src/files.validators";
import { SpeciesImageStorageInterceptor } from "src/images/images.interceptor";
import { CreateSpeciesDto, UpdateSpeciesDto } from "./species.dto";
import { SpeciesInterceptor } from "./species.interceptor";

@Controller('species')
export class SpeciesController {
    constructor(
        private readonly speciesService: SpeciesService
    ) { }

    @Post()
    @UseInterceptors(SpeciesImageStorageInterceptor)
    @UseInterceptors(SpeciesInterceptor)
    public async create(
        @Body() specieCreateData: CreateSpeciesDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {
        const specie = await this.speciesService.createSpecie(specieCreateData, files);
        return (await this.speciesService.findSpecie(specie.id)).toResponseObject()
    }

    @Get(':id')
    @UseInterceptors(SpeciesInterceptor)
    public async findOne(@Param('id', ParseIntPipe) id: number) {
        const specie = await this.speciesService.findSpecie(id);
        return await specie.toResponseObject()
    }

    @Get()
    @UseInterceptors(SpeciesInterceptor)
    public async findAll(@Query() query: PaginationType) {
        const skip = query.skip ? +query.skip : 0
        const species = await this.speciesService.findSpecies(skip, 10);
        return Promise.all(species.map(async specie => await specie.toResponseObject()))
    }

    @Patch(':id')
    @UseInterceptors(SpeciesInterceptor)
    public async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSpecies: UpdateSpeciesDto
    ) {
        return (await this.speciesService.updateSpecie(id, updateSpecies)).toResponseObject();
    }

    @Delete(':id')
    @UseInterceptors(SpeciesInterceptor)
    public async delete(@Param('id', ParseIntPipe) id: number) {
        return (await this.speciesService.deleteSpecie(id)).toResponseObject();
    }
}