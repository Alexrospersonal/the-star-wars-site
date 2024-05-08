import { Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseFilePipe, Post, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Response } from "express";
import * as path from "path";
import { ImagesService } from "./images.service";
import { existsSync } from "fs";
import { NotFoundError } from "rxjs";
import { FileInterceptor } from "@nestjs/platform-express";
import { Public } from "src/auth/auth.decorators";

@Controller('images')
export class ImagesController {
    constructor(
        private readonly imagesService: ImagesService,

    ) { }

    // @Get('*')
    // getUploadedImage(
    //     @Req() req: Request,
    //     @Res() res: Response
    // ) {
    //     const file = path.join(process.cwd(), 'uploads', req.url);

    //     if (existsSync(file)) {
    //         return res.sendFile(file);
    //     }
    //     throw new NotFoundException('Image not found');

    // }

    @Delete(':id')
    async deleteImage(@Param('id') id: number) {
        try {
            return await this.imagesService.deleteUploadedImage(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // TODO: зробити загрузку зображень, через різні контролери кожної сутності
    // і зберігати й додавати в певні папки
    @Post('upload')
    @Public()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile(
        new ParseFilePipe({
            validators: [

            ]
        })
    ) file: Express.Multer.File) {
        await this.imagesService.upload(file.originalname, file.buffer)
    }

    // Допрацювати щоб всі файли зберігались на amazon s3
    @Public()
    @Get(':filename')
    async getFile(
        @Param('filename') filename: string,
        @Res() res: Response) {
        const fileBuffer = await this.imagesService.getFile(filename);

        if (fileBuffer instanceof Buffer) {
            // TODO: замінити контент тайп на image/* і провірити роботу
            res.setHeader('Content-Type', 'image/jpeg');
            res.send(Buffer.from(fileBuffer));
        }
        throw new NotFoundException('Image not found');
    }
}