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
}
