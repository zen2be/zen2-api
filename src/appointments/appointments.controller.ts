import {
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/user.entity';
import { Appointment } from './appointment.entity';
import { AppointmentsService } from './appointments.service';

@ApiTags('appointments')
@Crud({
  model: {
    type: Appointment,
  },
})
@Controller('appointments')
export class AppointmentsController implements CrudController<Appointment> {
  constructor(public service: AppointmentsService) {}

  get base(): CrudController<Appointment> {
    return this;
  }

  @Roles(Role.Specialist, Role.Patient)
  @Post(':id/approve')
  async approveAppointment(@Param('id') id: number) {
    const approved = await this.service.approveAppointment(id);
    if (approved === false) {
      throw new HttpException(`Appointment not found`, HttpStatus.NOT_FOUND);
    }
    return approved;
  }

  @Roles(Role.Specialist, Role.Patient)
  @Post(':id/cancel')
  async cancelAppointment(@Param('id') id: number) {
    const canceled = await this.service.cancelAppointment(id);
    if (canceled === 'not found') {
      throw new HttpException(`Appointment not found`, HttpStatus.NOT_FOUND);
    } else if (canceled === 'date less now') {
      throw new HttpException(
        `You can't cancel an appointment that is in the past`,
        HttpStatus.BAD_REQUEST,
      );
    } else if (canceled === 'date less 24') {
      throw new HttpException(
        `You can't cancel an appointment less than 24 hours before the appointment`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return canceled;
  }
}
