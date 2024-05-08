import { Body, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Image } from "./images.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import { ConfigService } from "@nestjs/config";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

@Injectable()
export class ImagesService {

    private readonly s3Client = new S3Client({
        region: this.configService.getOrThrow('AWS_S3_REGION'),
    });

    constructor(
        @InjectRepository(Image)
        private imageRepository: Repository<Image>,
        private readonly configService: ConfigService,
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

    private async saveImage(file: Express.Multer.File, folder: string) {
        const name = folder + '/' + file.originalname;
        const image = this.imageRepository.create({ name });
        return await this.imageRepository.save(image);
    }

    public async saveImages(files: Array<Express.Multer.File>, folder: string) {
        const images: Image[] = [];

        for (const file of files) {
            images.push(await this.saveImage(file, folder));
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

    async upload(filename: string, folder: string, file: Buffer) {
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: 'tswuploader',
                Key: folder + '/' + filename,
                Body: file,
            })
        )
    }

    async uploadImages(files: Express.Multer.File[], folder: string) {
        const images = await this.saveImages(files, folder);

        for (const file of files) {
            await this.upload(file.originalname, folder, file.buffer);
        }

        return images;
    }


    async getFile(filename: string) {
        const command = new GetObjectCommand({
            Bucket: 'tswuploader',
            Key: filename,
        });
        const { Body, ...rest } = await this.s3Client.send(command);
        return Body instanceof Buffer ? Body : Buffer.from(await Body?.transformToByteArray());
    }
}