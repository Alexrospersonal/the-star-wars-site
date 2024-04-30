import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePlanetDto {
    @ApiProperty({
        description: 'The name of this planet.'
    })
    @IsString()
    readonly name: string;

    @ApiProperty({
        description: 'The diameter of this planet in kilometers.'
    })
    @IsString()
    readonly diameter: string;

    @ApiProperty({
        description: 'The number of standard hours it takes for this planet to complete a single rotation on its axis.'
    })
    @IsString()
    readonly rotation_period: string;

    @ApiProperty({
        description: 'The number of standard days it takes for this planet to complete a single orbit of its local star.'
    })
    @IsString()
    readonly orbital_period: string;

    @ApiProperty({
        description: 'A number denoting the gravity of this planet, where "1" is normal or 1 standard G. "2" is twice or 2 standard Gs. "0.5" is half or 0.5 standard Gs.'
    })
    @IsString()
    readonly gravity: string;

    @ApiProperty({
        description: 'The average population of sentient beings inhabiting this planet.'
    })
    @IsString()
    readonly population: string;

    @ApiProperty({
        description: 'The climate of this planet. Comma separated if diverse.'
    })
    @IsString()
    readonly climate: string;

    @ApiProperty({
        description: 'The terrain of this planet. Comma separated if diverse.'
    })
    @IsString()
    readonly terrain: string;

    @ApiProperty({
        description: 'The percentage of the planet surface that is naturally occurring water or bodies of water.'
    })
    @IsString()
    readonly surface_water: string;
}


export class UpdatePlanetDto extends PartialType(CreatePlanetDto) { }