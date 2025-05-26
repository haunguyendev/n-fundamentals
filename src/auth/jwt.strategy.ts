import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { authConstants } from "./auth.constants";
import { Injectable } from "@nestjs/common";
import { PayloadType } from "src/types/payload.type";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {

    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('SECRET') as string,
        });
    }

    async validate(payload: PayloadType) {
        return {
            userId: payload.userId,
            email: payload.email,
            artistId: payload.artistId
        }
    }
}