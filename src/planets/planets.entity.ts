import { Person } from "src/people/entities/people.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Image } from "src/images/images.entity";

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

    @OneToMany(() => Person, (person) => person.homeworld)
    residents: Person[]

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    edited: Date;

    @OneToMany(() => Image, (image) => image.planet)
    images: Image[]

}
