import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePeopleDto, UpdatePeopleDto } from './people.dto';
import { PaginationType } from './people.pagination';
import { ImageFileValidationPipe } from 'src/files.validators';
import { PeopleImageStorageInterceptor } from 'src/images/images.interceptor';
import { ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PersonInterceptor } from './people.interceptos';
import { Person } from './entities/people.entity';
import { AuthsGuard } from 'src/guards/auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('people')
@ApiTags('people')
export class PeopleController {
    constructor(
        private readonly peopleService: PeopleService,
    ) { }

    @Post()
    @UseInterceptors(PeopleImageStorageInterceptor)
    @UseInterceptors(PersonInterceptor)
    @ApiResponse({ status: 200, description: 'Created', type: Person })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async create(
        @Body() createPeople: CreatePeopleDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {
        try {
            const person = await this.peopleService.createPerson(createPeople, files);
            return await (await this.peopleService.findOne(person.id)).toResponseObject()
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // TODO: додати до всіх роутерів або глобально JwtAuthGuard
    // @UseGuards(JwtAuthGuard)
    @Get()
    @UseInterceptors(PersonInterceptor)
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'OK', type: Person })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async findAll(@Query() query: PaginationType) {
        const skip = query.skip ? +query.skip : 0

        try {
            const people = await this.peopleService.findPeople(skip, 10);
            return Promise.all(people.map(async (people) => await people.toResponseObject()));
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiProperty({ description: 'The id of the person' })
    @Get(':id')
    @UseInterceptors(PersonInterceptor)
    @ApiResponse({ status: 200, description: 'OK', type: Person })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        try {
            const person = await this.peopleService.findPerson(id);
            return await person.toResponseObject();
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch(':id')
    @UseInterceptors(PersonInterceptor)
    @ApiResponse({ status: 200, description: 'Updated', type: Person })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePeople: UpdatePeopleDto
    ) {
        try {
            return (await this.peopleService.updatePerson(id, updatePeople)).toResponseObject();
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @UseInterceptors(PersonInterceptor)
    @ApiResponse({ status: 200, description: 'Deleted', type: Person })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        try {
            return (await this.peopleService.deletePerson(id)).toResponseObject();
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
