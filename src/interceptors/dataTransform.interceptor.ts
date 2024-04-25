import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, from, map, of, switchMap } from "rxjs";

export interface Response<T> {
    data: T;
}

@Injectable()
export class DataTransformInteceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> | Promise<Observable<Response<T>>> {
        return next.handle().pipe(
            switchMap(data => {
                if (data instanceof Promise) {
                    return from(data).pipe(
                        map(resolvedData => {
                            return {
                                data: resolvedData
                            }
                        })
                    )
                } else {
                    return of({
                        data
                    });
                }
            })
        );
    }

}