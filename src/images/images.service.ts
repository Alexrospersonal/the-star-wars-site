import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Image } from "./images.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(Image)
        private imageRepository: Repository<Image>,
    ) { }

    public async deleteUploadedImage(id: number) {
        const image = await this.getOneImage(id);
        const filePath = path.join(process.cwd(), image.name);

        if (fs.existsSync(filePath)) {
            const unlinkAsync = util.promisify(fs.unlink);

            await unlinkAsync(filePath);

            return await this.deleteImage(id);
        }

        throw new NotFoundException(`Image #${id} can't be deleted`);
    }

    private async saveImage(file: Express.Multer.File) {
        const name = file.path;
        const image = this.imageRepository.create({ name });
        return await this.imageRepository.save(image);
    }

    public async saveImages(files: Array<Express.Multer.File>) {
        const images: Image[] = [];

        for (const file of files) {
            images.push(await this.saveImage(file));
        }

        return images;
    }

    public async deleteImage(id: number) {
        const image = await this.imageRepository.findOne({ where: { id: id } });

        if (!image) {
            throw new NotFoundException(`Person #${id} not found`);
        }

        return await this.imageRepository.remove(image);
    }

    public async getOneImage(id: number) {
        return await this.imageRepository.findOne({ where: { id: id } });
    }
}