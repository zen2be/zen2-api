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
import { Role } from 'src/users/user.entity';
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
  constructor(public service: TimeslotsService) {}

  get base(): CrudController<Timeslot> {
    return this;
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Timeslot,
  ) {
    if (dto.startTime > dto.endTime) {
      throw new BadRequestException('StartTime must be less than endTime');
    }
    return await this.base.createOneBase(req, dto);
  }
}
