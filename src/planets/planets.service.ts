import { Injectable } from "@nestjs/common";
import { DataBaseService } from "src/database/database.service";
import { ImagesService } from "src/images/images.service";

@Injectable()
export class PlanetsService {
    constructor(
        private readonly dataBaseService: DataBaseService,
        private readonly imagesService: ImagesService
    ) { }

    async getOnePlanet(id: number) {
        const planet = await this.dataBaseService.findOnePlanet(id);

        planet.images = this.imagesService.convertFilenametoURL(planet.images);

        return planet;
    }
}