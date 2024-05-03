import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

enum ROLES {
    ADMIN = "admin",
    USER = "user"
}

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>
    ) { }

    public async createUser(username: string, password: string) {
        const newUser = this.usersRepository.create({
            username: username,
            password: password,
            role: ROLES.USER
        })

        return await this.usersRepository.save(newUser);
    }

    public async findUserByName(username: string) {
        const user = await this.usersRepository.findOneBy({
            username: username
        })

        return user
    }
}
