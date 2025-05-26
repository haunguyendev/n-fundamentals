import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  getProfile(
    @Req() req,
  ) {
    const { password, ...result } = req.user;
    return {
      msg: "authenticated with api key",
      user: result
    }


  }
}
