import { Module } from '@nestjs/common';
import { TimeslotsService } from './timeslots.service';
import { TimeslotsController } from './timeslots.controller';
import { Timeslot } from './timeslot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Timeslot])],
  providers: [TimeslotsService],
  controllers: [TimeslotsController],
})
export class TimeslotsModule {}
