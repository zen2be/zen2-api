import { MailService } from 'src/mail/mail.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          email: user.email,
          sub: user.id,
          roles: user.role,
          verified: user.verified,
        },
        {
          secret: this.configService.get('JWT_PASSWORD_SECRET'),
          expiresIn: this.configService.get('JWT_PASSWORD_EXPIRY'),
        },
      ),
      this.jwtService.signAsync(
        {
          email: user.email,
          sub: user.id,
        },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRY'),
        },
      ),
    ]);

    const hash = await bcrypt.hash(
      rt,
      this.configService.get('JWT_REFRESH_SALT_ROUNDS'),
    );

    this.usersService.updateRefreshToken(user.id, hash);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async refreshTokens(accessToken: string) {
    const email = await this.verifyAccessToken(accessToken);
    const user = await this.usersService.findByEmail(email);

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          email: user.email,
          sub: user.id,
          roles: user.role,
          verified: user.verified,
        },
        {
          secret: this.configService.get('JWT_PASSWORD_SECRET'),
          expiresIn: this.configService.get('JWT_PASSWORD_EXPIRY'),
        },
      ),
      this.jwtService.signAsync(
        {
          email: user.email,
          sub: user.id,
        },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRY'),
        },
      ),
    ]);

    const hash = await bcrypt.hash(
      rt,
      this.configService.get('JWT_REFRESH_SALT_ROUNDS'),
    );

    this.usersService.updateRefreshToken(user.id, hash);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async confirmEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (user.verified) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.usersService.verifyUser(email);
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async resendConfirmation(id: number) {
    const user = await this.usersService.findOne(id);
    if (user.verified) {
      throw new BadRequestException('Email already confirmed');
    }
    const token = await this.usersService.createVerificationToken(user.email);
    await this.mailService.sendUserConfirmation(user, token);
  }

  async verifyAccessToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_PASSWORD_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async decodeRefreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      if (typeof payload === 'object' && 'id' in payload) {
        return payload.id;
      }
      throw new BadRequestException();
    } catch (error) {
      throw new BadRequestException('Bad refresh token');
    }
  }
}
