import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePeopleDto, UpdatePeopleDto } from './people.dto';
import { PaginationType } from './people.pagination';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImageFileValidationPipe } from 'src/files.validators';
import { ImagesService } from 'src/images/images.service';
import { DataBaseService } from 'src/database/database.service';
import { PeopleInterceptor } from 'src/images/images.interceptor';

@Controller('people')
export class PeopleController {
    constructor(
        private readonly peopleService: PeopleService,
        private readonly dataBaseService: DataBaseService,
    ) { }

    // TODO: додати валідацію вхідних данних через pipe
    @Post()
    @UseInterceptors(PeopleInterceptor)
    async create(
        @Body() createPeople: CreatePeopleDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {
        return await this.peopleService.create(createPeople, files);
    }

    @Get()
    findAll(@Query() query: PaginationType) {
        const skip = query.skip ? +query.skip : 0
        return this.dataBaseService.findPeople(skip, 10);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.dataBaseService.findPerson(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePeople: UpdatePeopleDto
    ) {
        return await this.dataBaseService.updatePerson(id, updatePeople);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.dataBaseService.deletePerson(id);
    }
}
