import { Image } from "src/images/images.entity";
import { Planet } from "src/planets/planets.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @ManyToOne(() => Planet, (planet) => planet.residents)
    homeworld: Planet;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    edited: Date;

    @OneToMany(() => Image, (image) => image.person)
    images: Image[]
}
