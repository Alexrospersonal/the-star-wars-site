import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UsersDto } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService
    ) { }
    async register(createUserDto: UsersDto) {
        const { username, password } = createUserDto;

        const user = await this.usersService.findUserByName(username);

        if (user) {
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await hash(password, 10);

        return await this.usersService.createUser(username, hashedPassword)
    }

    async login(user: any) {
        const payload = {
            username: user.username,
            sub: user.id,
            role: user.role
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    // async login(credentials: { username: string; password: string; }) {
    //     const { username, password } = credentials;

    //     const user = await this.validateUser(username, password)

    //     if (!user) {
    //         throw new UnauthorizedException('Invalid credentials');
    //     }

    //     return user;
    // }

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findUserByName(username);
        if (user && await compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}
