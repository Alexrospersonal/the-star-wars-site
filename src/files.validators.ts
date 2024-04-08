import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";


// @Injectable()
// export class FileSizeValidationPipe implements PipeTransform {
//     transform(value: any, metadata: ArgumentMetadata) {
//         const oneMb = 1000 * 1000;
//         return value.size < oneMb;
//     }

// }

@Injectable()
export class ImageFileValidationPipe implements PipeTransform {
    transform(files: Array<Express.Multer.File>, metadata: ArgumentMetadata) {

        files.forEach((file, idx, arr) => {
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
                throw new BadRequestException('Incorrect file format');
            }
        });
        return files;
    }
}