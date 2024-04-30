import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateStarshipDto {
    @ApiProperty({
        description: 'The Maximum number of Megalights this starship can travel in a standard hour. A "Megalight" is a standard unit of distance and has never been defined before within the Star Wars universe. This figure is only really useful for measuring the difference in speed of starships. We can assume it is similar to AU, the distance between our Sun (Sol) and Earth.'
    })
    @IsString()
    MGLT: string;

    @ApiProperty({
        description: 'The maximum number of kilograms that this starship can transport.'
    })
    @IsString()
    cargo_capacity: string;

    @ApiProperty({
        description: 'The maximum length of time that this starship can provide consumables for its entire crew without having to resupply.'
    })
    @IsString()
    consumables: string;

    @ApiProperty({
        description: ' The cost of this starship new, in galactic credits.'
    })
    @IsString()
    cost_in_credits: string;

    @ApiProperty({
        description: 'The number of personnel needed to run or pilot this starship.'
    })
    @IsString()
    crew: string;

    @ApiProperty({
        description: 'The class of this starships hyperdrive.'
    })
    @IsString()
    hyperdrive_rating: string;

    @ApiProperty({
        description: 'The length of this starship in meters.'
    })
    @IsString()
    length: string;

    @ApiProperty({
        description: 'The manufacturer of this starship. Comma separated if more than one.'
    })
    @IsString()
    manufacturer: string;

    @ApiProperty({
        description: ' The maximum speed of this starship in the atmosphere. "N/A" if this starship is incapable of atmospheric flight.'
    })
    @IsString()
    max_atmosphering_speed: string;

    @ApiProperty({
        description: 'The model or official name of this starship. Such as "T-65 X-wing" or "DS-1 Orbital Battle Station".'
    })
    @IsString()
    model: string;

    @ApiProperty({
        description: 'The name of this starship. The common name, such as "Death Star".'
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The number of non-essential people this starship can transport.'
    })
    @IsString()
    passengers: string;

    @ApiProperty({
        description: 'The class of this starship, such as "Starfighter" or "Deep Space Mobile Battlestation"'
    })
    @IsString()
    starship_class: string;

}


export class UpdateStarshipDto extends PartialType(CreateStarshipDto) { }