import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNumber, IsString } from "class-validator";

export class CreatePeopleDto {
    @ApiProperty({
        description: "The name of this person."
    })
    @IsString()
    readonly name: string;

    @ApiProperty({
        description: "The birth year of the person, using the in-universe standard of BBY or ABY - Before the Battle of Yavin or After the Battle of Yavin. The Battle of Yavin is a battle that occurs at the end of Star Wars episode IV: A New Hope."
    })
    @IsString()
    readonly birth_year: string;

    @ApiProperty({
        description: 'The eye color of this person. Will be "unknown" if not known or "n/a" if the person does not have an eye.'
    })
    @IsString()
    readonly eye_color: string;

    @ApiProperty({
        description: 'The gender of this person. Either "Male", "Female" or "unknown", "n/a" if the person does not have a gender.'
    })
    @IsString()
    readonly gender: string;

    @ApiProperty({
        description: 'The hair color of this person. Will be "unknown" if not known or "n/a" if the person does not have hair.'
    })
    @IsString()
    readonly hair_color: string;

    @ApiProperty({
        description: 'The height of the person in centimeters.'
    })
    @IsString()
    readonly height: string;

    @ApiProperty({
        description: 'The mass of the person in kilograms.'
    })
    @IsString()
    readonly mass: string;

    @ApiProperty({
        description: 'The skin color of this person.'
    })
    @IsString()
    readonly skin_color: string;

    @ApiProperty({
        description: 'The ID of a planet resource, a planet that this person was born on or inhabits.'
    })
    @IsNumber()
    readonly homeworld: number;

    @ApiProperty({
        description: 'An ID of species resource URLs that this person belongs to.',
        type: Number
    })
    @IsNumber()
    readonly specie: number;

    @ApiProperty({
        description: ' An array of starship resource IDs that this person has piloted.',
        type: [Number]
    })
    @IsArray()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    readonly starships: number[];

    @ApiProperty({
        description: 'An array of vehicle resource IDs that this person has piloted',
        type: [Number]
    })
    @IsArray()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    readonly vehicles: number[];
}

export class UpdatePeopleDto extends PartialType(CreatePeopleDto) { }