import { Person } from "src/people/entities/people.entity";
import { Planet } from "src/planets/planets.entity";
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
}