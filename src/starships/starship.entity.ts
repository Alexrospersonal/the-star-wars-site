import { IsString } from "class-validator";
import { Image } from "src/images/images.entity";
import { Person } from "src/people/entities/people.entity";
import { BASE_URL } from "src/settings";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Starships {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    MGLT: string;

    @Column()
    @IsString()
    cargo_capacity: string;

    @Column()
    @IsString()
    consumables: string;

    @Column()
    @IsString()
    cost_in_credits: string;

    @Column()
    @IsString()
    crew: string;

    @Column()
    @IsString()
    hyperdrive_rating: string;

    @Column()
    @IsString()
    length: string;

    @Column()
    @IsString()
    manufacturer: string;

    @Column()
    @IsString()
    max_atmosphering_speed: string;

    @Column()
    @IsString()
    model: string;

    @Column()
    @IsString()
    name: string;

    @Column()
    @IsString()
    passengers: string;

    // films: Film[]

    @ManyToMany(() => Person, (person) => person.starships, { lazy: true })
    @JoinTable()
    pilots: Promise<Person[]>

    starship_class: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    edited: Date;

    @OneToMany(() => Image, (image) => image.starship)
    images: Image[]

    async toResponseObject() {
        const pilots = await this.pilots;

        const pilotsUrl = pilots.map(pilot => `${BASE_URL}people/${pilot.id}`);

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
            pilots: pilotsUrl,
            created: this.created,
            edited: this.edited,
            images: this.images
        }
    }
}
