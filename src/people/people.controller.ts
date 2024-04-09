import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePeopleDto, UpdatePeopleDto } from './people.dto';
import { PeoplePagination } from './people.pagination';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImageFileValidationPipe } from 'src/files.validators';
import { ImagesService } from 'src/images/images.service';
import { DataBaseService } from 'src/database/database.service';

@Controller('people')
export class PeopleController {
    constructor(
        private readonly peopleService: PeopleService,
        private readonly dataBaseService: DataBaseService,
    ) { }

    // TODO: додати валідацію вхідних данних через pipe
    @Post()
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage({
            destination: './uploads/people',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async create(
        @Body() createPeople: CreatePeopleDto,
        @UploadedFiles(new ImageFileValidationPipe()) files: Array<Express.Multer.File>
    ) {
        return await this.peopleService.create(createPeople, files);
    }

    @Get()
    findAll(@Query() query: PeoplePagination) {
        const skip = query.skip ? +query.skip : 0
        return this.peopleService.findAll(skip);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.peopleService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePeople: UpdatePeopleDto) {
        return this.peopleService.update(id, updatePeople);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.peopleService.remove(id);
    }
}
