import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePeopleDto, UpdatePeopleDto } from './people.dto';
import { PaginationType } from './people.pagination';
import { ImageFileValidationPipe } from 'src/files.validators';
import { PeopleInterceptor } from 'src/images/images.interceptor';

@Controller('people')
export class PeopleController {
    constructor(
        private readonly peopleService: PeopleService,
    ) { }

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
        return this.peopleService.findPeople(skip, 10);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.peopleService.findPerson(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePeople: UpdatePeopleDto
    ) {
        return await this.peopleService.updatePerson(id, updatePeople);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.peopleService.deletePerson(id);
    }
}
