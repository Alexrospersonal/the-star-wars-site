import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Image } from "./images.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(Image)
        private imageRepository: Repository<Image>
    ) { }

    private async saveImage(file: Express.Multer.File) {
        const name = file.filename;
        const image = this.imageRepository.create({ name });
        const savedImage = await this.imageRepository.save(image);
        return savedImage.id;
    }

    public async saveImages(files: Array<Express.Multer.File>) {
        const imagesId: number[] = [];

        for (const file of files) {
            imagesId.push(await this.saveImage(file));
        }

        return imagesId;
    }
}