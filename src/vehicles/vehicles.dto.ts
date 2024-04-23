import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateVehicleDto {
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
    // films: number[]

}


export class UpdateVehicleDto extends PartialType(CreateVehicleDto) { }