import { BadRequestException, Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersDto } from 'src/users/users.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('register')
    async register(@Body() createUserDto: UsersDto) {
        try {
            return await this.authService.register(createUserDto);
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    // @Post('login')
    // @UseGuards(AuthGuard('local'))
    // async login(@Body() credentials: { username: string; password: string }) {
    //     const user = await this.authService.login(credentials);
    //     return user;
    // }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout() {
        return 'Logout successful';
    }
}
