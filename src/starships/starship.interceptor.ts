import { Injectable, NestInterceptor } from "@nestjs/common";
import { BASE_URL } from "src/settings";
import { Films } from "src/films/films.entity";
import { Person } from "src/people/entities/people.entity";
import { createInterceptFunction } from "src/interceptors/utils";
import { Starships } from "./starship.entity";


type StarshipType = Promise<Starships | {
    films: string[];
    pilots: string[];
}>

@Injectable()
export class StarshipsInterceptor implements NestInterceptor {
    intercept = createInterceptFunction<Starships, StarshipType>(changeDependencyDataToUrl);
}

async function changeDependencyDataToUrl(starship: Starships): StarshipType {
    if (!BASE_URL) {
        throw new Error('BASE_URL is not set');
    }

    const films: Films[] = await starship.films;
    const pilots: Person[] = await starship.pilots;

    return {
        ...starship,
        films: films ? films.map(film => `${BASE_URL}films/${film.id}`) : null,
        pilots: pilots ? pilots.map(person => `${BASE_URL}people/${person.id}`) : null,
    }
}