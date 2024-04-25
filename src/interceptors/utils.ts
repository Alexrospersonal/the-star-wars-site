import { CallHandler, ExecutionContext } from "@nestjs/common";
import { Observable, map } from "rxjs";

export function createInterceptFunction<T, U>(func: (ent: T) => U) {
    return function intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map(
                async (entity: T) => {
                    const mappingDependencyEnitity = await createChangeDependencyDataFunction<T, U>();
                    return await mappingDependencyEnitity(entity, func)
                }
            )
        )
    }
}

async function createChangeDependencyDataFunction<T, U>() {
    return async (entities: T, func: (ent: T) => U) => {
        if (Array.isArray(entities)) {
            return Promise.all(entities.map(async entity => await func(entity)));
        } else {
            return await func(entities);
        }
    }
}