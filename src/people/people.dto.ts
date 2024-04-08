import { PartialType } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsString } from "class-validator";

export class CreatePeopleDto {
    @IsString()
    readonly name: string;

    // @IsString()
    // readonly birth_year: string;

    // @IsString()
    // readonly eye_color: string;

    // @IsString()
    // readonly gender: string;

    // @IsString()
    // readonly hair_color: string;

    // @IsString()
    // readonly height: string;

    // @IsString()
    // readonly mass: string;

    // @IsString()
    // readonly skin_color: string;

    // @IsString()
    // readonly homeworld: string;

    // @IsArray()
    // @IsString({ each: true })
    // @ArrayMinSize(1)
    // readonly films: string[];

    // @IsArray()
    // @IsString({ each: true })
    // @ArrayMinSize(1)
    // readonly species: string[];

    // @IsArray()
    // @IsString({ each: true })
    // @ArrayMinSize(1)
    // readonly starships: string[];

    // @IsArray()
    // @IsString({ each: true })
    // @ArrayMinSize(1)
    // readonly vehicles: string[];

    // @IsString()
    // readonly url: string;

    // @IsString()
    // readonly created: string;

    // @IsString()
    // readonly edited: string;
}

export class UpdatePeopleDto extends PartialType(CreatePeopleDto) { }