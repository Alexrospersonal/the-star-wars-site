import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePlanetDto {
    @ApiProperty({

    })
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    diameter: string;

    @ApiProperty()
    @IsString()
    rotation_period: string;

    @ApiProperty()
    @IsString()
    orbital_period: string;

    @ApiProperty()
    @IsString()
    gravity: string;

    @ApiProperty()
    @IsString()
    population: string;

    @ApiProperty()
    @IsString()
    climate: string;

    @ApiProperty()
    @IsString()
    terrain: string;

    @ApiProperty()
    @IsString()
    surface_water: string;

    // films array
}


export class UpdatePlanetDto extends PartialType(CreatePlanetDto) { }