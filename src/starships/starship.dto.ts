import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateStarshipDto {
    @ApiProperty()
    @IsString()
    MGLT: string;

    @ApiProperty()
    @IsString()
    cargo_capacity: string;

    @ApiProperty()
    @IsString()
    consumables: string;

    @ApiProperty()
    @IsString()
    cost_in_credits: string;

    @ApiProperty()
    @IsString()
    crew: string;

    @ApiProperty()
    @IsString()
    hyperdrive_rating: string;

    @ApiProperty()
    @IsString()
    length: string;

    @ApiProperty()
    @IsString()
    manufacturer: string;

    @ApiProperty()
    @IsString()
    max_atmosphering_speed: string;

    @ApiProperty()
    @IsString()
    model: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    passengers: string;

    @ApiProperty()
    @IsString()
    starship_class: string;

}


export class UpdateStarshipDto extends PartialType(CreateStarshipDto) { }