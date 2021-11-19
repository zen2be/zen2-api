import { BadRequestException, Controller } from '@nestjs/common';
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
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService, private mailService: MailService) {}

  get base(): CrudController<User> {
    return this;
  }

  @Public()
  @Override()
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: User) {
    // create user in database
    const user = await this.base.createOneBase(req, dto).catch((err) => {
      throw new BadRequestException(err.message);
    });
    const token = await this.service.createVerificationToken(user.email);
    // send verification mail
    await this.mailService.sendUserConfirmation(user, token);
    return user;
  }

  @Roles(Role.Admin)
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }
}
