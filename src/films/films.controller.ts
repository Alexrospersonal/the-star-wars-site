import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilmsService } from "./films.service";
import { FilmsImageStorageInterceptor } from "src/images/images.interceptor";
import { CreateFilmDto, UpdateFilmDto } from "./films.dto";
import { ImageFileValidationPipe } from "src/files.validators";
import { PaginationType } from "src/people/people.pagination";
import { FilmInterceptor } from "./films.interceptor";

@Controller('films')
export class FilmsController {
    constructor(
        private readonly filmsService: FilmsService
    ) { }

    @Post()
    @UseInterceptors(FilmsImageStorageInterceptor)
    @UseInterceptors(FilmInterceptor)
    public async create(
        @Body() filmsData: CreateFilmDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {
        const film = await this.filmsService.createFilm(filmsData, files)
        return await (await this.filmsService.findFilm(film.id)).toResponseObject()
    }

    @Get(':id')
    @UseInterceptors(FilmInterceptor)
    public async findOne(
        @Param('id', ParseIntPipe) id: number
    ) {
        const film = await this.filmsService.findFilm(id);
        return await film.toResponseObject()
    }

    @Get()
    @UseInterceptors(FilmInterceptor)
    public async findAll(
        @Query() query: PaginationType
    ) {
        const skip = query.skip ? +query.skip : 0
        const films = await this.filmsService.findFilms(skip, 10);
        return Promise.all(films.map(async film => await film.toResponseObject()));
    }

    @Patch(':id')
    @UseInterceptors(FilmInterceptor)
    public async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateFilm: UpdateFilmDto
    ) {
        const film = await this.filmsService.updateFilm(id, updateFilm);
        return await film.toResponseObject()
    }

    @Delete(':id')
    @UseInterceptors(FilmInterceptor)
    public async delete(
        @Param('id', ParseIntPipe) id: number
    ) {
        const film = await this.filmsService.deleteFilm(id);
        return await film.toResponseObject()
    }
}