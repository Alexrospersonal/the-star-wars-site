import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseInterceptors } from "@nestjs/common";
import { DataBaseService } from "src/database/database.service";
import { CreatePlanetDto } from "./planets.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { UpdatePeopleDto } from "src/people/people.dto";

@Controller('planets')
export class PlanetsController {
    constructor(private readonly dataBaseService: DataBaseService) { }

    @Post()
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: diskStorage({
                destination: './uploads/planets',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                    cb(null, `${randomName}${extname(file.originalname)}`);
                }
            })
        })
    )
    async create(@Body() createPlanet: CreatePlanetDto) {
        // TODO: Call creating function from DB
    }

    @Get()
    findAll() {
        // TODO: Gat first 10 planets from DB, use pagination
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        // TODO: Get one planet from DB
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePlanet: UpdatePeopleDto
    ) {
        // TODO: call updating function from DB
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        // TODO: call deleting function from DB
    }
}