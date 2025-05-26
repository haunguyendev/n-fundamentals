import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { User } from 'src/users/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from 'src/types/payload.type';
import { Enable2FAType } from 'src/types/auth-types';
import * as speakeasy from 'speakeasy'
import { Not, UpdateResult } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private artistService: ArtistsService,
        private configService: ConfigService
    ) { }



    getEnvVariables() {
        return {
            port: this.configService.get<number>("port")
        }
    }


    async login(loginDTO: LoginDTO): Promise<{ accessToken: string } | { validate2FA: string, message: string }> {

        const user = await this.userService.findOne(loginDTO);
        const passwordMatched = await bcrypt.compare(loginDTO.password, user.password);
        if (!passwordMatched) {
            throw new UnauthorizedException("Password does not match");
        }

        const payload: PayloadType = {
            email: user.email,
            userId: user.id
        }
        const artist = await this.artistService.findArtist(user.id);
        if (artist) {
            payload.artistId = artist.id
        }

        // If user enable 2fa

        if (user.enable2FA && user.twoFASecret) {
            return {
                validate2FA: 'http://localhost:3000/auth/validate-2fa',
                message: 'Please enter the 2FA code from your Google Authentication app'
            };
        }
        return {
            accessToken: this.jwtService.sign(payload)
        }



    }
    async enable2FA(userId: number): Promise<Enable2FAType> {
        const user = await this.userService.findById(userId);
        if (user === null) {
            if (user === null) {
                throw new NotFoundException("User not found!");
            }

        } else {
            if (user.enable2FA) {
                return {
                    secret: user.twoFASecret
                }
            }
        }
        const secret = speakeasy.generateSecret();
        console.log(secret);
        user.twoFASecret = secret.base32;
        await this.userService.updateSecretKey(userId, user.twoFASecret);
        return {
            secret: user.twoFASecret
        }

    }
    async disable2FA(userId: number): Promise<UpdateResult> {
        return this.userService.disable2FA(userId);
    }

    async validate2FAToken(
        userId: number,
        token: string
    ): Promise<{ verified: boolean }> {
        try {
            const user = await this.userService.findById(userId);
            if (!user || !user.twoFASecret) {
                throw new NotFoundException("User or 2FA secret not found");
            }
            const verified = speakeasy.totp.verify({
                secret: user?.twoFASecret,
                token: token,
                encoding: 'base32',

            });
            if (verified) {
                return { verified: true }
            } else {
                return { verified: false }
            }
        } catch (err) {
            throw new UnauthorizedException('Error verifying token');
        }
    }

    async validateUserByApiKey(apiKey: string): Promise<User> {
        return this.userService.findByApiKey(apiKey);
    }


}
