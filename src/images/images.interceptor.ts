import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
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