import { Films } from "src/films/films.entity";
import { Person } from "src/people/entities/people.entity";
import { Planet } from "src/planets/planets.entity";
import { Species } from "src/species/species.entity";
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
    planet: Person

    @ManyToOne(() => Planet, (specie) => specie.images)
    specie: Species

    @ManyToOne(() => Planet, (starship) => starship.images)
    starship: Species

    @ManyToOne(() => Films, (film) => film.images)
    film: Species
}