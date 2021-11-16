import { Controller, Get } from '@nestjs/common';
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
  constructor(public service: UsersService) {}

  get base(): CrudController<User> {
    return this;
  }

  @Public()
  @Override()
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: User) {
    return this.base.createOneBase(req, dto);
  }

  @Roles(Role.Admin)
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }
}
