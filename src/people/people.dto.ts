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