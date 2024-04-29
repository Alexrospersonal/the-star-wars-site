import { Injectable, NestInterceptor } from "@nestjs/common";
import { BASE_URL } from "src/settings";

import { Films } from "src/films/films.entity";
import { createInterceptFunction } from "src/interceptors/utils";

type FilmType = Promise<Films | {
    characters: string[],
    planets: string[],
    species: string[],
    starships: string[],
    vehicles: string[]
}>

@Injectable()
export class FilmInterceptor implements NestInterceptor {
    intercept = createInterceptFunction<Films, FilmType>(changeDependencyDataToUrl);
}

async function changeDependencyDataToUrl(film: Films): FilmType {
    if (!BASE_URL) {
        throw new Error('BASE_URL is not set');
    }

    const characters = film.characters;
    const planets = film.planets;
    const species = film.species;
    const starships = film.starships;
    const vehicles = film.vehicles;

    return {
        ...film,
        characters: characters.map(person => `${BASE_URL}people/${person.id}`),
        planets: planets.map(planet => `${BASE_URL}planets/${planet.id}`),
        species: species.map(specie => `${BASE_URL}species/${specie.id}`),
        starships: starships.map(starship => `${BASE_URL}starships/${starship.id}`),
        vehicles: vehicles.map(vehicle => `${BASE_URL}vehicles/${vehicle.id}`),
    }
}