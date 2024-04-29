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
    episode_id: number;

    @Column({ type: "text" })
    opening_crawl: string;

    @Column()
    producer: string;

    @Column()
    release_date: string;

    @ManyToMany(() => Person, (person) => person.films)
    @JoinTable()
    characters: Person[]

    @ManyToMany(() => Planet, (planets) => planets.films)
    @JoinTable()
    planets: Planet[]

    @ManyToMany(() => Species, (species) => species.films)
    @JoinTable()
    species: Species[]

    @ManyToMany(() => Starships, (starships) => starships.films)
    @JoinTable()
    starships: Starships[]

    @ManyToMany(() => Vehicles, (vehicles) => vehicles.films)
    @JoinTable()
    vehicles: Vehicles[]

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    edited: Date;

    @OneToMany(() => Image, (image) => image.film)
    images: Image[]

    async toResponseObject() {
        return {
            id: this.id,
            title: this.title,
            director: this.director,
            episode_id: this.episode_id,
            opening_crawl: this.opening_crawl,
            producer: this.producer,
            release_date: this.release_date,

            characters: await this.characters,
            planets: await this.planets,
            species: await this.starships,
            starships: await this.starships,
            vehicles: await this.vehicles,

            created: this.created,
            edited: this.edited,
            images: this.images
        }
    }
}
