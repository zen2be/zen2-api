import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Appointment } from './appointment.entity';

@Injectable()
export class AppointmentsService extends TypeOrmCrudService<Appointment> {
  constructor(@InjectRepository(Appointment) repo) {
    super(repo);
  }

  async approveAppointment(appointmentId: number) {
    const appointment = await this.repo.findOne(appointmentId);
    if (appointment) {
      return await this.repo.update(appointmentId, { approved: true });
    }
    return false;
  }

  async cancelAppointment(appointmentId: number) {
    const appointment = await this.repo.findOne(appointmentId);
    if (appointment) {
      if (appointment.startDate < new Date(Date.now())) {
        return 'date less now';
      } else {
        if (
          Math.abs(
            appointment.startDate.getUTCDate() -
              new Date(Date.now()).getUTCDate(),
          ) /
            36e5 >
          24
        ) {
          return await this.repo.delete(appointmentId);
        } else {
          return 'date less 24';
        }
      }
    } else {
      return 'not found';
    }
  }

  async createAppointment(appointment: Appointment) {
    if (appointment) {
      const sd: Date = new Date(appointment.startDate);
      const today = new Date(Date.now());
      console.log(Math.abs(sd.getTime() - today.getTime()) / 3600000);
      if (sd < today) {
        return 'date less now';
      } else {
        if (appointment.startDate >= appointment.endDate) {
          return 'start > end';
        } else {
          if (Math.abs(sd.getTime() - today.getTime()) / 3600000 > 24) {
            return 'create';
          } else {
            return 'date less 24';
          }
        }
      }
    } else {
      return 'not found';
    }
  }
}
