import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Timeslot } from './timeslot.entity';

@Injectable()
export class TimeslotsService extends TypeOrmCrudService<Timeslot> {
  constructor(@InjectRepository(Timeslot) repo) {
    super(repo);
  }
}
