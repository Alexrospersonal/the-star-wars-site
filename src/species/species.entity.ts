import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Image } from "src/images/images.entity";
import { Person } from "src/people/entities/people.entity";
import { Planet } from "src/planets/planets.entity";
import { last } from "rxjs";
import { BASE_URL } from "src/settings";
import { Films } from "src/films/films.entity";

@Entity()
export class Species {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    average_height: string;

    @Column()
    average_lifespan: string;

    @Column()
    classification: string;

    @Column()
    designation: string;

    @Column()
    eye_colors: string;

    @Column()
    hair_colors: string;

    @Column()
    language: string;

    @Column()
    name: string;

    @Column()
    skin_colors: string;

    @OneToMany(() => Person, (person) => person.specie, { lazy: true })
    people: Promise<Person[]>

    @ManyToOne(() => Planet, (homeworld) => homeworld.species, { lazy: true })
    homeworld: Promise<Planet>;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    edited: Date;

    @OneToMany(() => Image, (image) => image.specie)
    images: Image[]

    @ManyToMany(() => Films, (films) => films.species)
    @JoinTable()
    films: Films[]

    async toResponseObject() {
        return {
            id: this.id,
            name: this.name,
            average_height: this.average_height,
            average_lifespan: this.average_lifespan,
            classification: this.classification,
            designation: this.designation,
            eye_colors: this.eye_colors,
            hair_colors: this.hair_colors,
            language: this.language,
            skin_colors: this.skin_colors,
            people: await this.people,
            homeworld: await this.homeworld,
            films: this.films,
            created: this.created,
            edited: this.edited,
            images: this.images
        }
    }
}