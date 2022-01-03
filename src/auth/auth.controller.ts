import {
  Controller,
  Request,
  Response,
  Post,
  UseGuards,
  Get,
  HttpCode,
  Query,
  Headers,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/public.decorator';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

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

  @Get('token/verify')
  async verifyToken(@Request() req, @Headers() headers) {
    // get the access token from auth header
    const authHeader = headers.authorization;
    const token = authHeader.replace('Bearer ', '');
    // verify the access token
    this.authService.verifyAccessToken(token);
  }

  @Post('token/refresh')
  async refreshToken(@Request() req, @Headers() headers) {
    const authHeader = headers.authorization;
    const token = authHeader.replace('Bearer ', '');
    const email = await this.authService.verifyAccessToken(token);
    const user = await this.usersService.findByEmail(email);

    // get refresh token of body
    const rt = req.body.refresh_token;
    if (!rt) {
      throw new BadRequestException('Provide a refresh token');
    }
    // compare to hash in database
    if (await bcrypt.compare(rt, user.refreshToken)) {
      // if hash matches, refresh tokens
      return this.authService.refreshTokens(token);
    } else {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  @Get('profile')
  async getProfile(@Request() req, @Headers() headers) {
    const authHeader = headers.authorization;
    const token = authHeader.replace('Bearer ', '');
    const email = await this.authService.verifyAccessToken(token);
    return this.usersService.findByEmail(email);
  }

  @Public()
  @Get('confirm')
  async confirm(@Query('token') token: string) {
    const email = await this.authService.decodeConfirmationToken(token);
    await this.authService.confirmEmail(email);
  }

  @Post('resend-confirm')
  async resendConfirmationLink(@Request() req, @Headers() headers) {
    const authHeader = headers.authorization;
    const token = authHeader.replace('Bearer ', '');
    const email = await this.authService.verifyAccessToken(token);
    const user = await this.usersService.findByEmail(email);
    await this.authService.resendConfirmation(user.id);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req, @Headers() headers) {
    const authHeader = headers.authorization;
    const token = authHeader.replace('Bearer ', '');
    const email = await this.authService.verifyAccessToken(token);
    const user = await this.usersService.findByEmail(email);
    await this.usersService.updateRefreshToken(user.id, null);
  }
}
