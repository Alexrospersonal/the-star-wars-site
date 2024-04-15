import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { Image } from "src/images/images.entity";
import { IMAGE_BASE_URL } from "src/settings";

@Injectable()
export class FileUrlTransformInteceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next
            .handle()
            .pipe(
                map(
                    data => {
                        if (Array.isArray(data) && data.every(item => item instanceof Image)) {
                            // return this.convertFilenametoURL(data);
                        } else {
                            return data;
                        }
                    }
                )
            )
    }

    public convertFilenametoURL(images: Image[]) {
        const url = images.map(image => {
            const splitedPath = image.name.split('\\');
            const name = splitedPath[splitedPath.length - 1];
            const folder = splitedPath[splitedPath.length - 2];

            return {
                id: image.id,
                name: `${IMAGE_BASE_URL}/${folder}/${name}`,
            } as Image
        });

        return url;
    }
}