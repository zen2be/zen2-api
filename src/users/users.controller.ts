import { BadRequestException, Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Roles } from 'src/auth/roles.decorator';
import { MailService } from 'src/mail/mail.service';
import { Public } from 'src/public.decorator';
import { Role, User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Crud({
  model: {
    type: User,
  },
})
@Roles(Role.Admin)
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(
    public service: UsersService,
    private mailService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  get base(): CrudController<User> {
    return this;
  }

  @Public()
  @Override()
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: User) {
    dto.refreshToken = await this.jwtService.signAsync(
      {
        email: dto.email,
        sub: dto.id,
      },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRY'),
      },
    );
    // create user in database
    const user = await this.base.createOneBase(req, dto).catch((err) => {
      throw new BadRequestException(err.message);
    });
    const token = await this.service.createVerificationToken(user.email);
    // send verification mail
    await this.mailService.sendUserConfirmation(user, token);
    return user;
  }

  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }
}
