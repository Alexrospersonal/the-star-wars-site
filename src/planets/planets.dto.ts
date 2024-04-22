import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePlanetDto {
    @ApiProperty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsString()
    readonly diameter: string;

    @ApiProperty()
    @IsString()
    readonly rotation_period: string;

    @ApiProperty()
    @IsString()
    readonly orbital_period: string;

    @ApiProperty()
    @IsString()
    readonly gravity: string;

    @ApiProperty()
    @IsString()
    readonly population: string;

    @ApiProperty()
    @IsString()
    readonly climate: string;

    @ApiProperty()
    @IsString()
    readonly terrain: string;

    @ApiProperty()
    @IsString()
    readonly surface_water: string;

    // films array
}


export class UpdatePlanetDto extends PartialType(CreatePlanetDto) { }