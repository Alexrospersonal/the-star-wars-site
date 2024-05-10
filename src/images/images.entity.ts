import { Films } from "src/films/films.entity";
import { Person } from "src/people/entities/people.entity";
import { Planet } from "src/planets/planets.entity";
import { Species } from "src/species/species.entity";
import { Starships } from "src/starships/starship.entity";
import { Vehicles } from "src/vehicles/vehicles.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Image {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Person, (person) => person.images)
    person: Person

    @ManyToOne(() => Planet, (planet) => planet.images)
    planet: Planet

    @ManyToOne(() => Species, (specie) => specie.images)
    specie: Species

    @ManyToOne(() => Starships, (starship) => starship.images)
    starship: Starships

    @ManyToOne(() => Vehicles, (vehicle) => vehicle.images)
    vehicle: Starships

    @ManyToOne(() => Films, (film) => film.images)
    film: Films
}