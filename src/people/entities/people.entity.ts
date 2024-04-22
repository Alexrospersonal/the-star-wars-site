import { Exclude } from "class-transformer";
import { IsString } from "class-validator";
import { Image } from "src/images/images.entity";
import { Planet } from "src/planets/planets.entity";
import { BASE_URL } from "src/settings";
import { Species } from "src/species/species.entity";
import { Starships } from "src/starships/starship.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


// TODO: Species та Image як lazy
@Entity()
export class Person {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    name: string;

    @Column()
    @IsString()
    birth_year: string;

    @Column()
    @IsString()
    eye_color: string;

    @Column()
    @IsString()
    gender: string;

    @Column()
    @IsString()
    hair_color: string;

    @Column()
    @IsString()
    height: string;

    @Column()
    @IsString()
    mass: string;

    @Column()
    @IsString()
    skin_color: string;

    @ManyToOne(() => Planet, (planet) => planet.residents, { lazy: true })
    homeworld: Promise<Planet>;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    edited: Date;

    @OneToMany(() => Image, (image) => image.person, { lazy: true })
    images: Promise<Image[]>

    @OneToMany(() => Starships, (starships) => starships.pilots, { lazy: true })
    starships: Promise<Starships[]>

    @ManyToOne(() => Species, (specie) => specie.people, { lazy: true })
    specie: Promise<Species>

    async toResponseObject() {
        const homeworld = await this.homeworld;
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
            specie: this.specie,
            created: this.created,
            edited: this.edited,
            homeworld: `${BASE_URL}planets/${homeworld.id}`
        }
    }
}
