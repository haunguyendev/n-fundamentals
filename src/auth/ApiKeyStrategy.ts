import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom'; // 👈 Phải dùng strategy phù hợp
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
    constructor(private readonly authService: AuthService) {
        super();
    }

    async validate(req: Request): Promise<any> {
        const apiKey = req.headers['x-api-key'] as string;

        if (!apiKey) {
            throw new UnauthorizedException('API Key missing');
        }

        const user = await this.authService.validateUserByApiKey(apiKey);
        if (!user) {
            throw new UnauthorizedException('Invalid API Key');
        }

        return user;
    }
}
