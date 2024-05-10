import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage, memoryStorage } from "multer";
import { extname } from "path";
import { Observable } from "rxjs";
import { IMAGE_BASE_PATH } from "src/settings";


export const PlanetImageStorageInterceptor = createImageInterceptor('planets');
export const PeopleImageStorageInterceptor = createImageInterceptor('people');
export const SpeciesImageStorageInterceptor = createImageInterceptor('species');
export const StarshipsImageStorageInterceptor = createImageInterceptor('starships');
export const VehiclessImageStorageInterceptor = createImageInterceptor('vehicles');
export const FilmsImageStorageInterceptor = createImageInterceptor('films');

function createImageInterceptor(imageFilesDir: string) {
    return FilesInterceptor('files', 10, {
        storage: diskStorage({
            destination: `${IMAGE_BASE_PATH}${imageFilesDir}`,
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    })
}

export const ImageRenameInterceptor = createImageRenameInterceptor()

function createImageRenameInterceptor() {
    return FilesInterceptor('files', 10, {
        storage: memoryStorage(),
        fileFilter: (req, file, cb) => {
            const replacedName = file.originalname.replaceAll(' ', '_');
            const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

            file.filename = `${replacedName+'_'+randomNum}${extname(file.originalname)}`;
            cb(null, true);
        },
      });
}


// export class RenameImageInterceptor implements NestInterceptor {
//     intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
//         const request = context.switchToHttp().getRequest();

//         if (!request.files) {
//             return null;
//         }
        
//         if (Array.isArray(request.files)) {
//             request.files.forEach( file => {
//                 const name: string = file.
//                 file.originalname.rep
//             })
//         }
//     }
    
// }