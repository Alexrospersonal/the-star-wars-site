import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateFilmDto {

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    director: string;

    @ApiProperty()
    @IsString()
    episode_id: string;

    @ApiProperty()
    @IsString()
    opening_crawl: string;

    @ApiProperty()
    @IsString()
    producer: string;

    @ApiProperty()
    @IsString()
    release_date: string;

    @IsArray()
    @IsNumber({}, { each: true })
    characters: number[]

    @IsArray()
    @IsNumber({}, { each: true })
    planets: number[]

    @IsArray()
    @IsNumber({}, { each: true })
    species: number[]

    @IsArray()
    @IsNumber({}, { each: true })
    starships: number[]

    @IsArray()
    @IsNumber({}, { each: true })
    vehicles: number[]

}


export class UpdateFilmDto extends PartialType(CreateFilmDto) { }