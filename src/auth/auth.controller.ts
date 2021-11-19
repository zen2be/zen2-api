import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/public.decorator';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  @ApiParam({ name: 'password', description: "The user's password" })
  @ApiParam({ name: 'email', description: "The user's email" })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Public()
  @Get('confirm')
  async confirm(@Query('token') token: string) {
    const email = await this.authService.decodeConfirmationToken(token);
    await this.authService.confirmEmail(email);
  }

  @Post('resend-confirm')
  async resendConfirmationLink(@Request() req) {
    await this.authService.resendConfirmation(req.user.userId);
  }
}
