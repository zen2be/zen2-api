import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Roles } from 'src/auth/roles.decorator';
import { Role, User } from 'src/users/user.entity';
import { PatientsService } from './patients.service';

@ApiTags('patients')
@Crud({
  model: {
    type: User,
  },
  query: {
    filter: [
      {
        field: 'role',
        operator: '$eq',
        value: 'patient',
      },
    ],
    exclude: ['password'],
  },
})
@Roles(Role.Admin, Role.Specialist)
@Controller('patients')
export class PatientsController implements CrudController<User> {
  constructor(public service: PatientsService) {}
}
