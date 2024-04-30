import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateFilmDto {

    @ApiProperty({
        description: 'The title of this film'
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: 'The name of the director of this film.'
    })
    @IsString()
    director: string;

    @ApiProperty({
        description: 'The episode number of this film.'
    })
    @IsNumber()
    episode_id: number;

    @ApiProperty({
        description: 'The opening paragraphs at the beginning of this film.'
    })
    @IsString()
    opening_crawl: string;

    @ApiProperty({
        description: 'The name(s) of the producer(s) of this film. Comma separated.'
    })
    @IsString()
    producer: string;

    @ApiProperty({
        description: 'The ISO 8601 date format of film release at original creator country.'
    })
    @IsString()
    release_date: string;

    @ApiProperty({
        description: 'An array of people resource IDs that are in this film.',
        type: [Number]
    })
    @IsArray()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    characters: number[]

    @ApiProperty({
        description: 'An array of planet resource IDs that are in this film.',
        type: [Number]
    })
    @IsArray()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    planets: number[]

    @ApiProperty({
        description: 'An array of species resource IDs that are in this film.',
        type: [Number]
    })
    @IsArray()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    species: number[]

    @ApiProperty({
        description: 'An array of starship resource IDs that are in this film.',
        type: [Number]
    })
    @IsArray()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    starships: number[]

    @ApiProperty({
        description: 'An array of vehicle resource IDs that are in this film.',
        type: [Number]
    })
    @IsArray()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    vehicles: number[]

}

export class UpdateFilmDto extends PartialType(CreateFilmDto) { }