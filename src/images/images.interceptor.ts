import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { IMAGE_BASE_PATH } from "src/settings";


export const PlanetInterceptor = createImageInterceptor('planets');
export const PeopleInterceptor = createImageInterceptor('people');

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