import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { StarshipsService } from "./starship.service";
import { StarshipsImageStorageInterceptor } from "src/images/images.interceptor";
import { ImageFileValidationPipe } from "src/files.validators";
import { CreateStarshipDto, UpdateStarshipDto } from "./starship.dto";
import { PaginationType } from "src/people/people.pagination";
import { StarshipsInterceptor } from "./starship.interceptor";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Starships } from "./starship.entity";
import { Roles } from 'src/auth/auth.decorators';
import { FilesInterceptor } from "@nestjs/platform-express";


@Controller('starships')
@ApiTags('starships')
export class StarshipsController {
    constructor(
        private readonly starshipsService: StarshipsService
    ) { }

    @Post()
    @Roles(['admin'])
    // @UseInterceptors(StarshipsImageStorageInterceptor)
    @UseInterceptors(FilesInterceptor('files'))
    @UseInterceptors(StarshipsInterceptor)
    @ApiResponse({ status: 200, description: 'Created', type: Starships })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async create(
        @Body() starshipData: CreateStarshipDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {
        try {
            const starship = await this.starshipsService.createStarship(starshipData, files);
            return await starship.toResponseObject()
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @Roles(['admin', 'user'])
    @UseInterceptors(StarshipsInterceptor)
    @ApiResponse({ status: 200, description: 'OK', type: Starships })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async findOne(@Param('id', ParseIntPipe) id: number) {
        try {
            const starship = await this.starshipsService.findStarship(id);
            return await starship.toResponseObject()
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    @Roles(['admin', 'user'])
    @UseInterceptors(StarshipsInterceptor)
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'OK', type: Starships })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async findAll(@Query() query: PaginationType) {
        const skip = query.skip ? +query.skip : 0

        try {
            const starships = await this.starshipsService.findStarships(skip, 10);
            return Promise.all(starships.map(async starship => await starship.toResponseObject()))
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch(':id')
    @Roles(['admin'])
    @UseInterceptors(StarshipsInterceptor)
    @ApiResponse({ status: 200, description: 'Updated', type: Starships })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateStarship: UpdateStarshipDto
    ) {
        try {
            const starship = await this.starshipsService.updateStarship(id, updateStarship);
            return await starship.toResponseObject()
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @Roles(['admin'])
    @UseInterceptors(StarshipsInterceptor)
    @ApiResponse({ status: 200, description: 'Deleted', type: Starships })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            const starship = await this.starshipsService.deleteStarship(id);
            return await starship.toResponseObject()
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}