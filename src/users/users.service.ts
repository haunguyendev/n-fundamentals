import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UnorderedBulkOperation, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user-dto';
import * as bcrypt from "bcryptjs"
import { v4 as uuid4 } from 'uuid'


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async create(createUserDTO: CreateUserDTO): Promise<Omit<User, 'password'>> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUserDTO.password, salt);
        const user = this.userRepository.create({
            ...CreateUserDTO,
            password: hashedPassword,
            apiKey: uuid4()
        });
        const savedUser = await this.userRepository.save(user);
        const { password, ...result } = savedUser;
        return result;
    }

    async findOne(data: Partial<User>): Promise<User> {
        console.log(data);
        const user = await this.userRepository.findOneBy({ email: data.email });
        if (!user) {
            throw new UnauthorizedException("Could not find User");
        }
        return user;

    }
    async updateSecretKey(userId, secret: string): Promise<UpdateResult> {
        return this.userRepository.update(
            { id: userId },
            {
                twoFASecret: secret,
                enable2FA: true
            }
        );
    }
    async findById(id: number): Promise<User | null> {
        return this.userRepository.findOneBy({ id });
    }
    async disable2FA(userId: number): Promise<UpdateResult> {
        return this.userRepository.update(
            { id: userId },
            {
                enable2FA: false,
                twoFASecret: undefined
            }
        );
    }
    async findByApiKey(apiKey: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ apiKey });
        if (!user) {
            throw new UnauthorizedException("Could not find User with provided API key");
        }
        return user;
    }



}
