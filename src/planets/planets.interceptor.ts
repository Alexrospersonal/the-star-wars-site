import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { Planet } from "./planets.entity";
import { BASE_URL } from "src/settings";
import { Films } from "src/films/films.entity";
import { Person } from "src/people/entities/people.entity";
import { Image } from "src/images/images.entity";
import { createInterceptFunction } from "src/interceptors/utils";


type PlanetType = Promise<Planet | {
    films: string[];
    residents: string[];
}>

@Injectable()
export class PlanetInterceptor implements NestInterceptor {
    intercept = createInterceptFunction<Planet, PlanetType>(changeDependencyDataToUrl);
}

async function changeDependencyDataToUrl(planet: Planet): PlanetType {
    if (!BASE_URL) {
        throw new Error('BASE_URL is not set');
    }

    const films: Films[] = await planet.films;
    const residents: Person[] = await planet.residents;

    return {
        ...planet,
        films: films.map(film => `${BASE_URL}films/${film.id}`),
        residents: residents.map(resident => `${BASE_URL}person/${resident.id}`),
    }
}