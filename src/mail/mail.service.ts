import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `${this.configService.get(
      'APP_URL',
    )}/auth/confirm?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      from: `"Zen2" <${this.configService.get('MAIL_FROM')}>`, // override default from
      subject: 'Welcome to Zen2! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.firstName,
        url,
      },
    });
  }
}
