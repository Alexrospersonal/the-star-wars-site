import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Image } from "src/images/images.entity";
import { Person } from "src/people/entities/people.entity";
import { Planet } from "src/planets/planets.entity";
import { Films } from "src/films/films.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Species {
    @ApiProperty({
        description: "Id of this resource."
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'The average height of this species in centimeters.'
    })
    @Column()
    average_height: string;

    @ApiProperty({
        description: 'The average lifespan of this species in years.'
    })
    @Column()
    average_lifespan: string;

    @ApiProperty({
        description: 'The classification of this species, such as "mammal" or "reptile".'
    })
    @Column()
    classification: string;

    @ApiProperty({
        description: 'The designation of this species, such as "sentient".'
    })
    @Column()
    designation: string;

    @ApiProperty({
        description: 'A comma-separated string of common eye colors for this species, "none" if this species does not typically have eyes.'
    })
    @Column()
    eye_colors: string;

    @ApiProperty({
        description: 'A comma-separated string of common hair colors for this species, "none" if this species does not typically have hair.'
    })
    @Column()
    hair_colors: string;

    @ApiProperty({
        description: 'The language commonly spoken by this species.'
    })
    @Column()
    language: string;

    @ApiProperty({
        description: 'The name of this species.'
    })
    @Column()
    name: string;

    @ApiProperty({
        description: 'A comma-separated string of common skin colors for this species, "none" if this species does not typically have skin.'
    })
    @Column()
    skin_colors: string;

    @ApiProperty({
        description: 'An array of People URL Resources that are a part of this species.',
        type: [String]
    })
    @OneToMany(() => Person, (person) => person.specie, { lazy: true })
    people: Promise<Person[]>

    @ApiProperty({
        description: ' The URL of a planet resource, a planet that this species originates from.',
        type: [String]
    })
    @ManyToOne(() => Planet, (homeworld) => homeworld.species, { lazy: true })
    homeworld: Promise<Planet>;

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
    @OneToMany(() => Image, (image) => image.specie)
    images: Image[]

    @ApiProperty({
        description: 'An array of Film URL Resources that this species has appeared in.'
    })
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