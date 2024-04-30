import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsString } from "class-validator";
import { Films } from "src/films/films.entity";
import { Image } from "src/images/images.entity";
import { Planet } from "src/planets/planets.entity";
import { BASE_URL } from "src/settings";
import { Species } from "src/species/species.entity";
import { Starships } from "src/starships/starship.entity";
import { Vehicles } from "src/vehicles/vehicles.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Person {

    @ApiProperty({
        description: "Id of this resource."
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: "The name of this person."
    })
    @Column()
    @IsString()
    name: string;

    @ApiProperty({
        description: "The birth year of the person, using the in-universe standard of BBY or ABY - Before the Battle of Yavin or After the Battle of Yavin. The Battle of Yavin is a battle that occurs at the end of Star Wars episode IV: A New Hope."
    })
    @Column()
    @IsString()
    birth_year: string;

    @ApiProperty({
        description: 'The eye color of this person. Will be "unknown" if not known or "n/a" if the person does not have an eye.'
    })
    @Column()
    @IsString()
    eye_color: string;

    @ApiProperty({
        description: 'The gender of this person. Either "Male", "Female" or "unknown", "n/a" if the person does not have a gender.'
    })
    @Column()
    @IsString()
    gender: string;

    @ApiProperty({
        description: 'The hair color of this person. Will be "unknown" if not known or "n/a" if the person does not have hair.'
    })
    @Column()
    @IsString()
    hair_color: string;

    @ApiProperty({
        description: 'The height of the person in centimeters.'
    })
    @Column()
    @IsString()
    height: string;

    @ApiProperty({
        description: 'The mass of the person in kilograms.'
    })
    @Column()
    @IsString()
    mass: string;

    @ApiProperty({
        description: 'The skin color of this person.'
    })
    @Column()
    @IsString()
    skin_color: string;

    @ApiProperty({
        description: 'The URL of a planet resource, a planet that this person was born on or inhabits.'
    })
    @ManyToOne(() => Planet, (planet) => planet.residents, { lazy: true })
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
    @OneToMany(() => Image, (image) => image.person)
    images: Image[]

    @ApiProperty({
        description: 'An array of starship resource URLs that this person has piloted.'
    })
    @ManyToMany(() => Starships, (starships) => starships.pilots)
    @JoinTable()
    starships: Starships[]

    @ApiProperty({
        description: 'An array of vehicle resource URLs that this person has piloted.'
    })
    @ManyToMany(() => Vehicles, (vehicles) => vehicles.pilots)
    @JoinTable()
    vehicles: Vehicles[]

    @ApiProperty({
        description: 'The specie resource URL that this person belongs to.',
        type: String
    })
    @ManyToOne(() => Species, (specie) => specie.people, { lazy: true })
    specie: Promise<Species>

    @ApiProperty({
        description: 'An array of film resource URLs that this person has been in.'
    })
    @ManyToMany(() => Films, (films) => films.characters)
    @JoinTable()
    films: Films[]

    async toResponseObject() {
        return {
            id: this.id,
            name: this.name,
            birth_year: this.birth_year,
            eye_color: this.eye_color,
            gender: this.gender,
            hair_color: this.hair_color,
            height: this.height,
            mass: this.mass,
            skin_color: this.skin_color,
            images: this.images,
            specie: await this.specie,
            films: this.films,
            starships: this.starships,
            vehicles: this.vehicles,
            homeworld: await this.homeworld,
            created: this.created,
            edited: this.edited,
        }
    }
}
