import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PasswordIsNotCommonlyUsed } from './users.validator';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    MailModule,
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_VERIFICATION_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_VERIFICATION_EXPIRY'),
        },
      }),
    }),
  ],
  providers: [PasswordIsNotCommonlyUsed, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
