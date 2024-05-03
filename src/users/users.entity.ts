import { IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    username: string;

    @Column()
    @IsString()
    password: string;

    @Column()
    @IsString()
    role: string;
}