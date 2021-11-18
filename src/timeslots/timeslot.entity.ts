import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMilitaryTime, Validate } from 'class-validator';
import { User } from 'src/users/user.entity';
import { IsSpecialist } from 'src/users/users.validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

enum Day {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'sunday',
}

@Entity()
export class Timeslot {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsEnum(Day)
  @Column('text')
  day: Day;

  @ApiProperty()
  @IsMilitaryTime()
  @Column()
  startTime: string;

  @ApiProperty()
  @IsMilitaryTime()
  @Column()
  endTime: string;

  @ApiProperty()
  @ManyToOne((type) => User)
  @Validate(IsSpecialist)
  specialist: User;
}
