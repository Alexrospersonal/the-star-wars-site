import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Films } from "src/films/films.entity";
import { Image } from "src/images/images.entity";
import { Person } from "src/people/entities/people.entity";
import { BASE_URL } from "src/settings";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Starships {

    @ApiProperty({
        description: "Id of this resource."
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'The Maximum number of Megalights this starship can travel in a standard hour. A "Megalight" is a standard unit of distance and has never been defined before within the Star Wars universe. This figure is only really useful for measuring the difference in speed of starships. We can assume it is similar to AU, the distance between our Sun (Sol) and Earth.'
    })
    @Column()
    @IsString()
    MGLT: string;

    @ApiProperty({
        description: 'The maximum number of kilograms that this starship can transport.'
    })
    @Column()
    @IsString()
    cargo_capacity: string;

    @ApiProperty({
        description: 'The maximum length of time that this starship can provide consumables for its entire crew without having to resupply.'
    })
    @Column()
    @IsString()
    consumables: string;

    @ApiProperty({
        description: ' The cost of this starship new, in galactic credits.'
    })
    @Column()
    @IsString()
    cost_in_credits: string;

    @ApiProperty({
        description: 'The number of personnel needed to run or pilot this starship.'
    })
    @Column()
    @IsString()
    crew: string;

    @ApiProperty({
        description: 'The class of this starships hyperdrive.'
    })
    @Column()
    @IsString()
    hyperdrive_rating: string;

    @ApiProperty({
        description: 'The length of this starship in meters.'
    })
    @Column()
    @IsString()
    length: string;

    @ApiProperty({
        description: 'The manufacturer of this starship. Comma separated if more than one.'
    })
    @Column()
    @IsString()
    manufacturer: string;

    @ApiProperty({
        description: ' The maximum speed of this starship in the atmosphere. "N/A" if this starship is incapable of atmospheric flight.'
    })
    @Column()
    @IsString()
    max_atmosphering_speed: string;

    @ApiProperty({
        description: 'The model or official name of this starship. Such as "T-65 X-wing" or "DS-1 Orbital Battle Station".'
    })
    @Column()
    @IsString()
    model: string;

    @ApiProperty({
        description: 'The name of this starship. The common name, such as "Death Star".'
    })
    @Column()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The number of non-essential people this starship can transport.'
    })
    @Column()
    @IsString()
    passengers: string;

    @ApiProperty({
        description: 'An array of People URL Resources that this starship has been piloted by.'
    })
    @ManyToMany(() => Person, (person) => person.starships)
    @JoinTable()
    pilots: Person[]

    @ApiProperty({
        description: 'The class of this starship, such as "Starfighter" or "Deep Space Mobile Battlestation"'
    })
    @Column()
    @IsString()
    starship_class: string;

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
    @OneToMany(() => Image, (image) => image.starship)
    images: Image[]

    @ApiProperty({
        description: 'An array of Film URL Resources that this starship has appeared in'
    })
    @ManyToMany(() => Films, (films) => films.starships)
    @JoinTable()
    films: Films[]

    async toResponseObject() {
        return {
            id: this.id,
            name: this.name,
            MGLT: this.MGLT,
            cargo_capacity: this.cargo_capacity,
            consumables: this.consumables,
            cost_in_credits: this.cost_in_credits,
            crew: this.crew,
            hyperdrive_rating: this.hyperdrive_rating,
            length: this.length,
            manufacturer: this.manufacturer,
            max_atmosphering_speed: this.max_atmosphering_speed,
            model: this.model,
            passengers: this.passengers,
            pilots: this.pilots,
            films: this.films,
            created: this.created,
            edited: this.edited,
            images: this.images
        }
    }
}
