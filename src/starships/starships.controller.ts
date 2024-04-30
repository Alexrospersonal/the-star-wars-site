import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { StarshipsService } from "./starship.service";
import { StarshipsImageStorageInterceptor } from "src/images/images.interceptor";
import { ImageFileValidationPipe } from "src/files.validators";
import { CreateStarshipDto, UpdateStarshipDto } from "./starship.dto";
import { PaginationType } from "src/people/people.pagination";
import { StarshipsInterceptor } from "./starship.interceptor";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Starships } from "./starship.entity";


@Controller('starships')
@ApiTags('starships')
export class StarshipsController {
    constructor(
        private readonly starshipsService: StarshipsService
    ) { }

    @Post()
    @UseInterceptors(StarshipsImageStorageInterceptor)
    @UseInterceptors(StarshipsInterceptor)
    @ApiResponse({ status: 200, description: 'Created', type: Starships })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async create(
        @Body() starshipData: CreateStarshipDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {
        const starship = await this.starshipsService.createStarship(starshipData, files);
        return await starship.toResponseObject()
    }

    @Get(':id')
    @UseInterceptors(StarshipsInterceptor)
    @ApiResponse({ status: 200, description: 'OK', type: Starships })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async findOne(@Param('id', ParseIntPipe) id: number) {
        const starship = await this.starshipsService.findStarship(id);
        return await starship.toResponseObject()
    }

    @Get()
    @UseInterceptors(StarshipsInterceptor)
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'OK', type: Starships })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async findAll(@Query() query: PaginationType) {
        const skip = query.skip ? +query.skip : 0
        const starships = await this.starshipsService.findStarships(skip, 10);
        return Promise.all(starships.map(async starship => await starship.toResponseObject()))
    }

    @Patch(':id')
    @UseInterceptors(StarshipsInterceptor)
    @ApiResponse({ status: 200, description: 'Updated', type: Starships })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateStarship: UpdateStarshipDto
    ) {
        const starship = await this.starshipsService.updateStarship(id, updateStarship);
        return await starship.toResponseObject()
    }

    @Delete(':id')
    @UseInterceptors(StarshipsInterceptor)
    @ApiResponse({ status: 200, description: 'Deleted', type: Starships })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async delete(@Param('id', ParseIntPipe) id: number) {
        const starship = await this.starshipsService.deleteStarship(id);
        return await starship.toResponseObject()
    }
}