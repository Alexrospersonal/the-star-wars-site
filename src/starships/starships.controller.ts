import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { StarshipsService } from "./starship.service";
import { StarshipsInterceptor } from "src/images/images.interceptor";
import { ImageFileValidationPipe } from "src/files.validators";
import { CreateStarshipDto, UpdateStarshipDto } from "./starship.dto";
import { PaginationType } from "src/people/people.pagination";


@Controller('starships')
export class StarshipsController {
    constructor(
        private readonly starshipsService: StarshipsService
    ) { }

    @Post()
    @UseInterceptors(StarshipsInterceptor)
    public async create(
        @Body() starshipData: CreateStarshipDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {
        const starship = await this.starshipsService.createStarship(starshipData, files);
        return starship
    }

    @Get(':id')
    public async findOne(@Param('id', ParseIntPipe) id: number) {
        const starship = await this.starshipsService.findStarship(id);
        return starship
    }

    @Get()
    public async findAll(@Query() query: PaginationType) {
        const skip = query.skip ? +query.skip : 0
        return this.starshipsService.findStarships(skip, 10);
    }

    @Patch(':id')
    public async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateStarship: UpdateStarshipDto
    ) {
        return await this.starshipsService.updateStarship(id, updateStarship);
    }

    @Delete(':id')
    public async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.starshipsService.deleteStarship(id);
    }
}