import { Controller, Delete, Get, Param, Req, Res } from "@nestjs/common";
import { Response } from "express";
import * as path from "path";
import { ImagesService } from "./images.service";

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
        // const imagePath = req.url.replace('/images/', '');
        const file = path.join(process.cwd(), 'uploads', req.url);
        return res.sendFile(file);
    }

    @Delete(':id')
    async deleteImage(@Param('id') id: number) {
        return await this.imagesService.deleteUploadedImage(id);
    }
}