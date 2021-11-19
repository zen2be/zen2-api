import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { AppointmentsModule } from './appointments/appointments.module';
import { TreatmentsModule } from './treatments/treatments.module';
import { PatientsModule } from './patients/patients.module';
import { SpecialistsModule } from './specialists/specialists.module';
import { TimeslotsModule } from './timeslots/timeslots.module';
import { MailModule } from './mail/mail.module';
import { EmailConfirmGuard } from './auth/email-confirm.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: Joi.object({
        APP_PORT: Joi.number().required(),
        APP_ENV: Joi.string().required(),
        APP_URL: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().empty(''),
        DB_NAME: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
        JWT_PASSWORD_SECRET: Joi.string().required(),
        JWT_PASSWORD_EXPIRY: Joi.string().required(),
        JWT_VERIFICATION_SECRET: Joi.string().required(),
        JWT_VERIFICATION_EXPIRY: Joi.string().required(),
        MAIL_HOST: Joi.string().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_FROM: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    AppointmentsModule,
    TreatmentsModule,
    PatientsModule,
    SpecialistsModule,
    TimeslotsModule,
    MailModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: EmailConfirmGuard,
    },
  ],
})
export class AppModule {}
