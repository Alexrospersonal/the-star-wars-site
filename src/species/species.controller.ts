import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { SpeciesService } from "./species.service";
import { query } from "express";
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
    public create(
        @Body() specie: CreateSpeciesDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {

    }

    @Get(':id')
    public findOne(@Param('id', ParseIntPipe) id: number) {

    }

    @Get()
    public findAll(@Query() query: PaginationType) {

    }

    public update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSpecies: UpdateSpeciesDto
    ) {

    }

    @Delete(':id')
    public delete(@Param('id', ParseIntPipe) id: number) {

    }
}