import { BadRequestException, Controller, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { AuthService } from 'src/auth/auth.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Treatment } from './treatment.entity';
import { TreatmentsService } from './treatments.service';

@ApiTags('treatments')
@Crud({
  model: {
    type: Treatment,
  },
})
@Controller('treatments')
@Roles(Role.Specialist)
export class TreatmentsController implements CrudController<Treatment> {
  constructor(
    public service: TreatmentsService,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  get base(): CrudController<Treatment> {
    return this;
  }

  @Override()
  async getMany(@ParsedRequest() req: CrudRequest, @Headers() headers) {
    const authHeader = headers.authorization;
    const token = authHeader.replace('Bearer ', '');
    const email = await this.authService.verifyAccessToken(token);
    const user = await this.usersService.findByEmail(email);
    req.options.query.filter = { 'Treatment.specialistId': user.id };
    return this.base.getManyBase(req);
  }

  @Override()
  async getOne(@ParsedRequest() req: CrudRequest, @Headers() headers) {
    const authHeader = headers.authorization;
    const token = authHeader.replace('Bearer ', '');
    const email = await this.authService.verifyAccessToken(token);
    const user = await this.usersService.findByEmail(email);
    req.options.query.filter = { 'Treatment.specialistId': user.id };
    return this.base.getOneBase(req);
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Treatment,
  ) {
    return await this.base.createOneBase(req, dto).catch((err) => {
      throw new BadRequestException(err.message);
    });
  }
}
