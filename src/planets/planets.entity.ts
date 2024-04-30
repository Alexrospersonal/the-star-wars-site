import { Person } from "src/people/entities/people.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Image } from "src/images/images.entity";
import { Species } from "src/species/species.entity";
import { Films } from "src/films/films.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Planet {

    @ApiProperty({
        description: "Id of this resource."
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'The name of this planet.'
    })
    @Column()
    name: string;

    @ApiProperty({
        description: 'The diameter of this planet in kilometers.'
    })
    @Column()
    diameter: string;

    @ApiProperty({
        description: 'The number of standard hours it takes for this planet to complete a single rotation on its axis.'
    })
    @Column()
    rotation_period: string;

    @ApiProperty({
        description: 'The number of standard days it takes for this planet to complete a single orbit of its local star.'
    })
    @Column()
    orbital_period: string;

    @ApiProperty({
        description: 'A number denoting the gravity of this planet, where "1" is normal or 1 standard G. "2" is twice or 2 standard Gs. "0.5" is half or 0.5 standard Gs.'
    })
    @Column()
    gravity: string;

    @ApiProperty({
        description: 'The average population of sentient beings inhabiting this planet.'
    })
    @Column()
    population: string;

    @ApiProperty({
        description: 'The climate of this planet. Comma separated if diverse.'
    })
    @Column()
    climate: string;

    @ApiProperty({
        description: 'The terrain of this planet. Comma separated if diverse.'
    })
    @Column()
    terrain: string;

    @ApiProperty({
        description: 'The percentage of the planet surface that is naturally occurring water or bodies of water.'
    })
    @Column()
    surface_water: string;

    @ApiProperty({
        description: 'An array of People URL Resources that live on this planet.'
    })
    @OneToMany(() => Person, (person) => person.homeworld, { lazy: true })
    residents: Promise<Person[]>

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

    @OneToMany(() => Species, (specie) => specie.homeworld, { lazy: true })
    species: Promise<Species[]>

    @ApiProperty({
        description: 'An array of images resource URLs.'
    })
    @OneToMany(() => Image, (image) => image.planet)
    images: Image[]

    @ApiProperty({
        description: 'An array of Film URL Resources that this planet has appeared in'
    })
    @ManyToMany(() => Films, (films) => films.planets)
    @JoinTable()
    films: Films[]

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
            films: this.films,
            images: this.images,
            created: this.created,
            edited: this.edited
        }
    }

}
