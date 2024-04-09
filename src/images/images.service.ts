import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Image } from "./images.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataBaseService } from "src/database/database.service";

@Injectable()
export class ImagesService {
    constructor(private readonly dataBaseService: DataBaseService) { }

}