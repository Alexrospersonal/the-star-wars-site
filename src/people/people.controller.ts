import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePeopleDto, UpdatePeopleDto } from './people.dto';
import { PaginationType } from './people.pagination';
import { ImageFileValidationPipe } from 'src/files.validators';
import { PeopleInterceptor } from 'src/images/images.interceptor';
import { ApiProperty } from '@nestjs/swagger';
import { PersonInterceptor } from './people.interceptos';

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
        return (await this.peopleService.createPerson(createPeople, files)).toResponseObject();
    }

    @Get()
    @UseInterceptors(PersonInterceptor)
    async findAll(@Query() query: PaginationType) {
        const skip = query.skip ? +query.skip : 0
        const people = await this.peopleService.findPeople(skip, 10);
        return Promise.all(people.map(async (people) => await people.toResponseObject()));
    }

    @ApiProperty({ description: 'The id of the person' })
    @Get(':id')
    @UseInterceptors(PersonInterceptor)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const person = await this.peopleService.findPerson(id);
        return await person.toResponseObject();
    }

    @Patch(':id')
    @UseInterceptors(PersonInterceptor)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePeople: UpdatePeopleDto
    ) {
        return (await this.peopleService.updatePerson(id, updatePeople)).toResponseObject();
    }

    @Delete(':id')
    @UseInterceptors(PersonInterceptor)
    async remove(@Param('id', ParseIntPipe) id: number) {
        return (await this.peopleService.deletePerson(id)).toResponseObject();
    }
}
