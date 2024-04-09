import { PartialType } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreatePlanetDto {
    @IsString()
    name: string;

    @IsString()
    diameter: string;

    @IsString()
    rotation_period: string;

    @IsString()
    orbital_period: string;

    @IsString()
    gravity: string;

    @IsString()
    population: string;

    @IsString()
    climate: string;

    @IsString()
    terrain: string;

    @IsString()
    surface_water: string;

    // films array
}


export class UpdatePlanetDto extends PartialType(CreatePlanetDto) { }