import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Films } from "src/films/films.entity";
import { Image } from "src/images/images.entity";
import { Person } from "src/people/entities/people.entity";
import { BASE_URL } from "src/settings";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Vehicles {

    @ApiProperty({
        description: "Id of this resource."
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'The maximum number of kilograms that this vehicle can transport.'
    })
    @Column()
    @IsString()
    cargo_capacity: string;

    @ApiProperty({
        description: 'The maximum length of time that this vehicle can provide consumables for its entire crew without having to resupply.'
    })
    @Column()
    @IsString()
    consumables: string;

    @ApiProperty({
        description: 'The cost of this vehicle new, in Galactic Credits.'
    })
    @Column()
    @IsString()
    cost_in_credits: string;

    @ApiProperty({
        description: 'The number of personnel needed to run or pilot this vehicle.'
    })
    @Column()
    @IsString()
    crew: string;

    @ApiProperty({
        description: 'The length of this vehicle in meters.'
    })
    @Column()
    @IsString()
    length: string;

    @ApiProperty({
        description: 'The manufacturer of this vehicle. Comma separated if more than one.'
    })
    @Column()
    @IsString()
    manufacturer: string;

    @ApiProperty({
        description: 'The maximum speed of this vehicle in the atmosphere.'
    })
    @Column()
    @IsString()
    max_atmosphering_speed: string;

    @ApiProperty({
        description: 'The model or official name of this vehicle. Such as "All-Terrain Attack Transport".'
    })
    @Column()
    @IsString()
    model: string;

    @ApiProperty({
        description: 'The name of this vehicle. The common name, such as "Sand Crawler" or "Speeder bike".'
    })
    @Column()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The number of non-essential people this vehicle can transport.'
    })
    @Column()
    @IsString()
    passengers: string;

    @ApiProperty({
        description: 'The class of this vehicle, such as "Wheeled" or "Repulsorcraft".'
    })
    @Column()
    @IsString()
    vehicle_class: string;

    @ApiProperty({
        description: ' An array of People URL Resources that this vehicle has been piloted by'
    })
    @ManyToMany(() => Person, (person) => person.vehicles)
    @JoinTable()
    pilots: Person[]

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
        description: 'An array of Film URL Resources that this vehicle has appeared in.'
    })
    @ManyToMany(() => Films, (films) => films.vehicles)
    @JoinTable()
    films: Films[]

    async toResponseObject() {
        return {
            id: this.id,
            name: this.name,
            cargo_capacity: this.cargo_capacity,
            consumables: this.consumables,
            cost_in_credits: this.cost_in_credits,
            crew: this.crew,
            length: this.length,
            manufacturer: this.manufacturer,
            max_atmosphering_speed: this.max_atmosphering_speed,
            model: this.model,
            passengers: this.passengers,
            vehicle_class: this.vehicle_class,
            pilots: this.pilots,
            films: this.films,
            created: this.created,
            edited: this.edited,
            images: this.images
        }
    }
}
