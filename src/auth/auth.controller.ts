import {
  Controller,
  Request,
  Response,
  Post,
  UseGuards,
  Get,
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
  @ApiParam({ name: 'password', description: "The user's password" })
  @ApiParam({ name: 'email', description: "The user's email" })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }
}
