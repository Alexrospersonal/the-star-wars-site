
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateSpeciesDto {

    @ApiProperty()
    @IsString()
    average_height: string;

    @ApiProperty()
    @IsString()
    average_lifespan: string;

    @ApiProperty()
    @IsString()
    classification: string;

    @ApiProperty()
    @IsString()
    designation: string;

    @ApiProperty()
    @IsString()
    eye_colors: string;

    @ApiProperty()
    @IsString()
    hair_colors: string;

    @ApiProperty()
    @IsNumber()
    homeworld: number;

    @ApiProperty()
    @IsString()
    language: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    skin_colors: string;
}


export class UpdateSpeciesDto extends PartialType(CreateSpeciesDto) { }