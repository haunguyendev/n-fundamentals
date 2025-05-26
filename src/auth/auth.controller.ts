import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user-dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './jwt-guard';
import { Enable2FAType } from 'src/types/auth-types';
import { AuthService } from './auth.service';
import { UpdateResult } from 'typeorm';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { LoginDTO } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags("auth")
export class AuthController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) { }


    @ApiOperation({ summary: 'register new user' })
    @ApiResponse({
        status: 201,
        description: 'It will return the user in the response'
    })
    @Post('signup')

    signup(@Body() createUserDTO: CreateUserDTO): Promise<Omit<User, 'password'>> {
        return this.userService.create(createUserDTO);
    }
    @ApiOperation({
        summary: "Login user"
    })
    @ApiResponse({
        status: 200,
        description: "It will give you the access_token in the response"
    })
    @Post('login')
    login(@Body() loginDTO: LoginDTO): Promise<{ accessToken: string } | { validate2FA: string, message: string }> {

        return this.authService.login(loginDTO);
    }

    @Post('enable-2fa')
    @UseGuards(JwtAuthGuard)
    enable2FA(
        @Req() req): Promise<Enable2FAType> {
        console.log(req.user);
        return this.authService.enable2FA(req.user.userId);
    }

    @Get('disable-2fa')
    @UseGuards(JwtAuthGuard)
    disable2FA(
        @Req() req): Promise<UpdateResult> {
        return this.authService.disable2FA(req.user.userId);
    }

    @Post('validate-2fa')
    @UseGuards(JwtAuthGuard)
    validate2FA(
        @Req() req,
        @Body() validateTokenDTO: ValidateTokenDTO): Promise<{ verified: boolean }> {

        return this.authService.validate2FAToken(req.user.userId, validateTokenDTO.token)
    }

    @Get('test')
    testEnv() {
        return this.authService.getEnvVariables();
    }






}
