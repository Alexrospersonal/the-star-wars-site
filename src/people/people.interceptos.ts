import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { Person } from "./entities/people.entity";
import { BASE_URL } from "src/settings";
import { Planet } from "src/planets/planets.entity";
import { Species } from "src/species/species.entity";
import { Films } from "src/films/films.entity";
import { Starships } from "src/starships/starship.entity";
import { Vehicles } from "src/vehicles/vehicles.entity";
import { createInterceptFunction } from "src/interceptors/utils";

type PersonType = Promise<Person | {
    homeworld: string,
    specie: string,
    films: string[],
    starships: string[],
    vehicles: string[]
}>

@Injectable()
export class PersonInterceptor implements NestInterceptor {
    intercept = createInterceptFunction<Person, PersonType>(changeDependencyDataToUrl);
}

async function changeDependencyDataToUrl(person: Person): PersonType {
    if (!BASE_URL) {
        throw new Error('BASE_URL is not set');
    }

    const homeworld: Planet = await person.homeworld;
    const specie: Species = await person.specie;

    const films: Films[] = await person.films;
    const starships: Starships[] = await person.starships;
    const vehicles: Vehicles[] = await person.vehicles;

    return {
        ...person,
        homeworld: homeworld ? `${BASE_URL}planets/${homeworld.id}` : null,
        specie: specie ? `${BASE_URL}species/${specie.id}` : null,
        films: films.map(film => `${BASE_URL}films/${film.id}`),
        starships: starships.map(starship => `${BASE_URL}starships/${starship.id}`),
        vehicles: vehicles.map(vehicle => `${BASE_URL}vehicles/${vehicle.id}`),
    }
}


// @Injectable()
// export class PersonInterceptor implements NestInterceptor {
//     intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
//         return next.handle().pipe(
//             map(async (person: Person) => {
//                 if (Array.isArray(person)) {
//                     return Promise.all(person.map(async (p) => await changeDependencyDataToUrl(p)));
//                 } else {
//                     return await changeDependencyDataToUrl(person);
//                 }
//             })
//         )
//     }
// }

// async function changeDependencyDataToUrl(person: Person) {
//     if (!BASE_URL) {
//         throw new Error('BASE_URL is not set');
//     }

//     const homeworld: Planet = await person.homeworld;
//     const specie: Species = await person.specie;

//     const films: Films[] = await person.films;
//     const starships: Starships[] = await person.starships;
//     const vehicles: Vehicles[] = await person.vehicles;

//     return {
//         ...person,
//         homeworld: homeworld ? `${BASE_URL}planets/${homeworld.id}` : null,
//         specie: specie ? `${BASE_URL}species/${specie.id}` : null,
//         films: films.map(film => `${BASE_URL}films/${film.id}`),
//         starships: starships.map(starship => `${BASE_URL}starships/${starship.id}`),
//         vehicles: vehicles.map(vehicle => `${BASE_URL}vehicles/${vehicle.id}`),
//     }
// }