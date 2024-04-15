
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateSpeciesDto {
    @IsString()
    average_height: string;

    @IsString()
    average_lifespan: string;

    @IsString()
    classification: string;

    @IsString()
    designation: string;

    @IsString()
    eye_colors: string;

    @IsString()
    hair_colors: string;

    @IsNumber()
    homeworld: number;

    @IsString()
    language: string;

    @IsString()
    name: string;

    @IsArray()
    @IsNumber({}, { each: true })
    people: number[];

    @IsString()
    skin_colors: string;

    // @IsArray()
    // @IsNumber({}, { each: true })
    // films: number[];
}

export class UpdateSpeciesDto extends PartialType(CreateSpeciesDto) { }