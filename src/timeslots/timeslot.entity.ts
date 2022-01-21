import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsEnum, IsMilitaryTime, IsOptional, Validate } from 'class-validator';
import { User } from 'src/users/user.entity';
import { IsSpecialist } from 'src/users/users.validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
const { UPDATE } = CrudValidationGroups;

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
  @IsOptional({ groups: [UPDATE] })
  day: Day;

  @ApiProperty()
  @IsMilitaryTime()
  @Column()
  startTime: string;

  @ApiProperty()
  @IsMilitaryTime()
  @Column()
  endTime: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.timeslots, { onDelete: 'SET NULL' })
  @Validate(IsSpecialist)
  @IsOptional({ groups: [UPDATE] })
  specialist: User;
}
