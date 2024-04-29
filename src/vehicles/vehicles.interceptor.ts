import { Injectable, NestInterceptor } from "@nestjs/common";
import { BASE_URL } from "src/settings";
import { Films } from "src/films/films.entity";
import { Person } from "src/people/entities/people.entity";
import { createInterceptFunction } from "src/interceptors/utils";
import { Vehicles } from "./vehicles.entity";


type VehiclesType = Promise<Vehicles | {
    films: string[];
    pilots: string[];
}>

@Injectable()
export class VehiclesInterceptor implements NestInterceptor {
    intercept = createInterceptFunction<Vehicles, VehiclesType>(changeDependencyDataToUrl);
}

async function changeDependencyDataToUrl(vehicle: Vehicles): VehiclesType {
    if (!BASE_URL) {
        throw new Error('BASE_URL is not set');
    }

    const films: Films[] = await vehicle.films;
    const pilots: Person[] = await vehicle.pilots;

    return {
        ...vehicle,
        films: films ? films.map(film => `${BASE_URL}films/${film.id}`) : null,
        pilots: pilots ? pilots.map(person => `${BASE_URL}people/${person.id}`) : null,
    }
}