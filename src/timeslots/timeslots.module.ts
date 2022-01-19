import { Module } from '@nestjs/common';
import { TimeslotsService } from './timeslots.service';
import { TimeslotsController } from './timeslots.controller';
import { Timeslot } from './timeslot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Timeslot]), AuthModule, UsersModule],
  providers: [TimeslotsService],
  controllers: [TimeslotsController],
})
export class TimeslotsModule {}
