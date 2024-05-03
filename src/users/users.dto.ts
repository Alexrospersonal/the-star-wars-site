import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UsersDto {
    @ApiProperty({
        description: ''
    })
    @IsString()
    username: string;

    @ApiProperty({
        description: ''
    })
    @IsString()
    password: string;
}