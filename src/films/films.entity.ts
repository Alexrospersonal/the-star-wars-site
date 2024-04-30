import { ApiProperty } from "@nestjs/swagger";
import { Image } from "src/images/images.entity";
import { Person } from "src/people/entities/people.entity";
import { Planet } from "src/planets/planets.entity";
import { Species } from "src/species/species.entity";
import { Starships } from "src/starships/starship.entity";
import { Vehicles } from "src/vehicles/vehicles.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Films {
    @ApiProperty({
        description: "Id of this resource."
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'The title of this film'
    })
    @Column()
    title: string;

    @ApiProperty({
        description: 'The name of the director of this film.'
    })
    @Column()
    director: string;

    @ApiProperty({
        description: 'The episode number of this film.'
    })
    @Column()
    episode_id: number;

    @ApiProperty({
        description: 'The opening paragraphs at the beginning of this film.'
    })
    @Column({ type: "text" })
    opening_crawl: string;

    @ApiProperty({
        description: 'The name(s) of the producer(s) of this film. Comma separated.'
    })
    @Column()
    producer: string;

    @ApiProperty({
        description: 'The ISO 8601 date format of film release at original creator country.'
    })
    @Column()
    release_date: string;

    @ApiProperty({
        description: 'An array of people resource URLs that are in this film.',
        type: [String]
    })
    @ManyToMany(() => Person, (person) => person.films)
    @JoinTable()
    characters: Person[]

    @ApiProperty({
        description: 'An array of planet resource URLs that are in this film.',
        type: [String]
    })
    @ManyToMany(() => Planet, (planets) => planets.films)
    @JoinTable()
    planets: Planet[]

    @ApiProperty({
        description: 'An array of species resource URLs that are in this film.',
        type: [String]
    })
    @ManyToMany(() => Species, (species) => species.films)
    @JoinTable()
    species: Species[]

    @ApiProperty({
        description: 'An array of starship resource URLs that are in this film.',
        type: [String]
    })
    @ManyToMany(() => Starships, (starships) => starships.films)
    @JoinTable()
    starships: Starships[]

    @ApiProperty({
        description: 'An array of vehicle resource URLs that are in this film.',
        type: [String]
    })
    @ManyToMany(() => Vehicles, (vehicles) => vehicles.films)
    @JoinTable()
    vehicles: Vehicles[]

    @ApiProperty({
        description: 'The ISO 8601 date format of the time that this resource was created.'
    })
    @CreateDateColumn()
    created: Date;

    @ApiProperty({
        description: 'The ISO 8601 date format of the time that this resource was edited.'
    })
    @UpdateDateColumn()
    edited: Date;

    @ApiProperty({
        description: 'An array of images resource URLs.'
    })
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
