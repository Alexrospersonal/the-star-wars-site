import { ApiProperty, PartialType } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsNumber, IsString } from "class-validator";

export class CreatePeopleDto {
    @ApiProperty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsString()
    readonly birth_year: string;

    @ApiProperty()
    @IsString()
    readonly eye_color: string;

    @ApiProperty()
    @IsString()
    readonly gender: string;

    @ApiProperty()
    @IsString()
    readonly hair_color: string;

    @ApiProperty()
    @IsString()
    readonly height: string;

    @ApiProperty()
    @IsString()
    readonly mass: string;

    @ApiProperty()
    @IsString()
    readonly skin_color: string;

    @ApiProperty()
    @IsNumber()
    readonly homeworld: number;

    @ApiProperty()
    @IsNumber()
    readonly specie: number;

}

export class UpdatePeopleDto extends PartialType(CreatePeopleDto) { }