import { Image } from "src/images/images.entity";
import { Person } from "src/people/entities/people.entity";
import { Planet } from "src/planets/planets.entity";
import { Species } from "src/species/species.entity";
import { Starships } from "src/starships/starship.entity";
import { Vehicles } from "src/vehicles/vehicles.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Films {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    director: string;

    @Column()
    episode_id: string;

    @Column()
    opening_crawl: string;

    @Column()
    producer: string;

    @Column()
    release_date: string;

    @ManyToMany(() => Person, (person) => person.films, { lazy: true })
    @JoinTable()
    characters: Promise<Person[]>

    @ManyToMany(() => Planet, (planets) => planets.films, { lazy: true })
    @JoinTable()
    planets: Promise<Planet[]>

    @ManyToMany(() => Species, (species) => species.films, { lazy: true })
    @JoinTable()
    species: Promise<Species[]>

    @ManyToMany(() => Starships, (starships) => starships.films, { lazy: true })
    @JoinTable()
    starships: Promise<Starships[]>

    @ManyToMany(() => Vehicles, (vehicles) => vehicles.films, { lazy: true })
    @JoinTable()
    vehicles: Promise<Vehicles[]>

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    edited: Date;

    @OneToMany(() => Image, (image) => image.film)
    images: Image[]
}
