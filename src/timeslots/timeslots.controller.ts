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
import { Timeslot } from './timeslot.entity';
import { TimeslotsService } from './timeslots.service';

@ApiTags('timeslots')
@Crud({
  model: {
    type: Timeslot,
  },
})
@Controller('timeslots')
@Roles(Role.Specialist)
export class TimeslotsController implements CrudController<Timeslot> {
  constructor(
    public service: TimeslotsService,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  get base(): CrudController<Timeslot> {
    return this;
  }

  @Override()
  async getMany(@ParsedRequest() req: CrudRequest, @Headers() headers) {
    const authHeader = headers.authorization;
    const token = authHeader.replace('Bearer ', '');
    const email = await this.authService.verifyAccessToken(token);
    const user = await this.usersService.findByEmail(email);
    req.options.query.filter = { 'Timeslot.specialistId': user.id };
    return this.base.getManyBase(req);
  }

  @Override()
  async getOne(@ParsedRequest() req: CrudRequest, @Headers() headers) {
    const authHeader = headers.authorization;
    const token = authHeader.replace('Bearer ', '');
    const email = await this.authService.verifyAccessToken(token);
    const user = await this.usersService.findByEmail(email);
    req.options.query.filter = { 'Timeslot.specialistId': user.id };
    return this.base.getOneBase(req);
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Timeslot,
  ) {
    if (dto.startTime > dto.endTime || dto.startTime == dto.endTime) {
      throw new BadRequestException('StartTime must be less than endTime');
    }
    const existingTimeslots = await this.service.find({
      where: {
        specialist: dto.specialist,
      },
    });

    for (const timeslot of existingTimeslots) {
      if (
        dto.startTime > timeslot.startTime &&
        dto.startTime < timeslot.endTime
      ) {
        throw new BadRequestException(
          `Timeslots can't overlap, choose another time`,
        );
      }
    }
    return await this.base.createOneBase(req, dto);
  }

  @Override()
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Timeslot,
  ) {
    if (dto.startTime > dto.endTime || dto.startTime == dto.endTime) {
      throw new BadRequestException('StartTime must be less than endTime');
    }
    const existingTimeslots = await this.service.find({
      where: {
        specialist: dto.specialist,
      },
    });

    for (const timeslot of existingTimeslots) {
      if (
        dto.startTime > timeslot.startTime &&
        dto.startTime < timeslot.endTime
      ) {
        throw new BadRequestException(
          `Timeslots can't overlap, choose another time`,
        );
      }
    }
    return await this.base.updateOneBase(req, dto);
  }
}
