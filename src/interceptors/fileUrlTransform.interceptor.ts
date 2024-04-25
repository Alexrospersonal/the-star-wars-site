import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, from, map, switchMap } from "rxjs";
import { Image } from "src/images/images.entity";
import { IMAGE_BASE_URL } from "src/settings";

@Injectable()
export class FileUrlTransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next
            .handle()
            .pipe(
                switchMap(data => {
                    if (data instanceof Promise) {
                        return from(data).pipe(map(
                            data => {
                                if (Array.isArray(data)) {
                                    return data.map(d => {
                                        return this.applyFilenameToUrl(d);
                                    })
                                } else {
                                    return this.applyFilenameToUrl(data);
                                }
                                // if (data && Array.isArray(data.images) && data.images.every(item => item instanceof Image)) {
                                //     data.images = this.convertFilenametoURL(data.images);
                                //     return data;
                                // } else {
                                //     return data;
                                // }
                            }
                        ))
                    } else {
                        return data
                    }
                })
                // map(
                //     data => {
                //         if (data && Array.isArray(data.images) && data.images.every(item => item instanceof Image)) {
                //             data.images = this.convertFilenametoURL(data.images);
                //             return data;
                //         } else {
                //             return data;
                //         }
                //     }
                // )
            )
    }

    public applyFilenameToUrl<T extends { images: Image[] | string[] }>(data: T) {
        if (data && Array.isArray(data.images) && data.images.every(item => item instanceof Image)) {
            data.images = this.convertFilenametoURL(data.images as Image[]);
            return data;
        } else {
            return data;
        }
    }

    public convertFilenametoURL(images: Image[]) {
        const url = images.map(image => {
            const splitedPath = image.name.split('\\');
            const name = splitedPath[splitedPath.length - 1];
            const folder = splitedPath[splitedPath.length - 2];

            return `${IMAGE_BASE_URL}/${folder}/${name}`;
            // return {
            //     id: image.id,
            //     name: `${IMAGE_BASE_URL}/${folder}/${name}`,
            // } as Image
        });

        return url;
    }
}