import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Roles } from 'src/auth/roles.decorator';
import { Role, User } from 'src/users/user.entity';
import { SpecialistsService } from './specialists.service';

@ApiTags('specialists')
@Crud({
  model: {
    type: User,
  },
  query: {
    filter: [
      {
        field: 'role',
        operator: '$eq',
        value: 'specialist',
      },
    ],
  },
})
@Roles(Role.Admin)
@Controller('specialists')
export class SpecialistsController implements CrudController<User> {
  constructor(public service: SpecialistsService) {}
}
