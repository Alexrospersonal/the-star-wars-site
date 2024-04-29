import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { BASE_URL } from "src/settings";
import { Films } from "src/films/films.entity";
import { Person } from "src/people/entities/people.entity";
import { Image } from "src/images/images.entity";
import { createInterceptFunction } from "src/interceptors/utils";
import { Species } from "./species.entity";
import { Planet } from "src/planets/planets.entity";


type SpeciesType = Promise<Species | {
    films: string[];
    people: string[];
    homeworld: string;
}>

@Injectable()
export class SpeciesInterceptor implements NestInterceptor {
    intercept = createInterceptFunction<Species, SpeciesType>(changeDependencyDataToUrl);
}

async function changeDependencyDataToUrl(specie: Species): SpeciesType {
    if (!BASE_URL) {
        throw new Error('BASE_URL is not set');
    }

    const films: Films[] = await specie.films;
    const people: Person[] = await specie.people;
    const homeworld: Planet = await specie.homeworld;

    return {
        ...specie,
        homeworld: homeworld ? `${BASE_URL}planets/${homeworld.id}` : null,
        films: films ? films.map(film => `${BASE_URL}films/${film.id}`) : null,
        people: people.map(person => `${BASE_URL}people/${person.id}`),
    }
}