import { Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Req, Res } from "@nestjs/common";
import { Response } from "express";
import * as path from "path";
import { ImagesService } from "./images.service";
import { existsSync } from "fs";
import { NotFoundError } from "rxjs";

@Controller('images')
export class ImagesController {
    constructor(
        private readonly imagesService: ImagesService
    ) { }

    @Get('*')
    getUploadedImage(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const file = path.join(process.cwd(), 'uploads', req.url);

        if (existsSync(file)) {
            return res.sendFile(file);
        }
        throw new NotFoundException('Image not found');

    }

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
}