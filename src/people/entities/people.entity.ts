import { Image } from "src/images/images.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Person {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    birth_year: string;

    @Column()
    eye_color: string;

    @Column()
    gender: string;

    @Column()
    hair_color: string;

    @Column()
    height: string;

    @Column()
    mass: string;

    @Column()
    skin_color: string;

    @Column()
    homeworld: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    edited: Date;

    @OneToMany(() => Image, (image) => image.person)
    images: Image[]
}

// readonly name: string;
// readonly birth_year: string;
// readonly eye_color: string;
// readonly gender: string;
// readonly hair_color: string;
// readonly height: string;
// readonly mass: string;
// readonly skin_color: string;
// readonly homeworld: string;
// readonly url: string;
// readonly created: string;
// readonly edited: string;

// readonly films: string[];
// readonly species: string[];
// readonly starships: string[];
// readonly vehicles: string[];