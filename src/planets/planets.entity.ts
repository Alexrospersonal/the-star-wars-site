import { Person } from "src/people/entities/people.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Image } from "src/images/images.entity";
import { Species } from "src/species/species.entity";
import { Films } from "src/films/films.entity";

@Entity()
export class Planet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    diameter: string;

    @Column()
    rotation_period: string;

    @Column()
    orbital_period: string;

    @Column()
    gravity: string;

    @Column()
    population: string;

    @Column()
    climate: string;

    @Column()
    terrain: string;

    @Column()
    surface_water: string;

    @OneToMany(() => Person, (person) => person.homeworld, { lazy: true })
    residents: Promise<Person[]>

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    edited: Date;

    @OneToMany(() => Species, (specie) => specie.homeworld, { lazy: true })
    species: Promise<Species[]>

    @OneToMany(() => Image, (image) => image.planet)
    images: Image[]

    @ManyToMany(() => Films, (films) => films.planets, { lazy: true })
    @JoinTable()
    films: Promise<Films[]>

    async toResponseObject() {
        return {
            id: this.id,
            name: this.name,
            diameter: this.diameter,
            rotation_period: this.rotation_period,
            orbital_period: this.orbital_period,
            gravity: this.gravity,
            population: this.population,
            climate: this.climate,
            terrain: this.terrain,
            surface_water: this.surface_water,
            residents: await this.residents,
            films: await this.films,
            images: this.images,
            created: this.created,
            edited: this.edited
        }
    }

}
