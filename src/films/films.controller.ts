import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilmsService } from "./films.service";
import { FilmsImageStorageInterceptor } from "src/images/images.interceptor";
import { CreateFilmDto, UpdateFilmDto } from "./films.dto";
import { ImageFileValidationPipe } from "src/files.validators";
import { PaginationType } from "src/people/people.pagination";

@Controller('films')
export class FilmsController {
    constructor(
        private readonly filmsService: FilmsService
    ) { }

    @Post()
    @UseInterceptors(FilmsImageStorageInterceptor)
    public async create(
        @Body() filmsData: CreateFilmDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {
        const films = await this.filmsService.createFilm(filmsData, files)
        return films
    }

    @Get(':id')
    public async findOne(
        @Param('id', ParseIntPipe) id: number
    ) {
        const film = await this.filmsService.findFilm(id);
        return film;
    }

    @Get()
    public async findAll(
        @Query() query: PaginationType
    ) {
        const skip = query.skip ? +query.skip : 0
        return await this.filmsService.findFilms(skip, 10);
    }

    public async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateFilm: UpdateFilmDto
    ) {
        const film = await this.filmsService.updateFilm(id, updateFilm);
        return film
    }

    public async delete(
        @Param('id', ParseIntPipe) id: number
    ) {
        const film = await this.filmsService.deleteFilm(id);
        return film
    }
}