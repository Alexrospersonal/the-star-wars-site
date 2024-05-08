import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { SpeciesService } from "./species.service";
import { PaginationType } from "src/people/people.pagination";
import { ImageFileValidationPipe } from "src/files.validators";
import { SpeciesImageStorageInterceptor } from "src/images/images.interceptor";
import { CreateSpeciesDto, UpdateSpeciesDto } from "./species.dto";
import { SpeciesInterceptor } from "./species.interceptor";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Species } from "./species.entity";
import { Roles } from 'src/auth/auth.decorators';
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller('species')
@ApiTags('species')
export class SpeciesController {
    constructor(
        private readonly speciesService: SpeciesService
    ) { }

    @Post()
    @Roles(['admin'])
    // @UseInterceptors(SpeciesImageStorageInterceptor)
    @UseInterceptors(FilesInterceptor('files'))
    @UseInterceptors(SpeciesInterceptor)
    @ApiResponse({ status: 200, description: 'Created', type: Species })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async create(
        @Body() specieCreateData: CreateSpeciesDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {
        try {
            const specie = await this.speciesService.createSpecie(specieCreateData, files);
            return (await this.speciesService.findSpecie(specie.id)).toResponseObject()
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @Roles(['admin', 'user'])
    @UseInterceptors(SpeciesInterceptor)
    @ApiResponse({ status: 200, description: 'OK', type: Species })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async findOne(@Param('id', ParseIntPipe) id: number) {
        try {
            const specie = await this.speciesService.findSpecie(id);
            return await specie.toResponseObject()
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    @Roles(['admin', 'user'])
    @UseInterceptors(SpeciesInterceptor)
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'OK', type: Species })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async findAll(@Query() query: PaginationType) {
        const skip = query.skip ? +query.skip : 0

        try {
            const species = await this.speciesService.findSpecies(skip, 10);
            return Promise.all(species.map(async specie => await specie.toResponseObject()))
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch(':id')
    @Roles(['admin'])
    @UseInterceptors(SpeciesInterceptor)
    @ApiResponse({ status: 200, description: 'Updated', type: Species })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSpecies: UpdateSpeciesDto
    ) {
        try {
            return (await this.speciesService.updateSpecie(id, updateSpecies)).toResponseObject();
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @Roles(['admin'])
    @UseInterceptors(SpeciesInterceptor)
    @ApiResponse({ status: 200, description: 'Deleted', type: Species })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    public async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            return (await this.speciesService.deleteSpecie(id)).toResponseObject();
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}