import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Image } from "./images.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataBaseService } from "src/database/database.service";
import { IMAGE_BASE_URL } from "src/settings";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";

@Injectable()
export class ImagesService {
    constructor(private readonly dataBaseService: DataBaseService) { }

    public async deleteUploadedImage(id: number) {
        const image = await this.dataBaseService.getOneImage(id);
        const filePath = path.join(process.cwd(), image.name);

        if (fs.existsSync(filePath)) {
            const unlinkAsync = util.promisify(fs.unlink);

            await unlinkAsync(filePath);

            return await this.dataBaseService.deleteImage(id);
        }

        throw new NotFoundException(`Image #${id} can't be deleted`);
    }
}