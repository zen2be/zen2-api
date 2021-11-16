import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { Treatment } from 'src/treatments/treatment.entity';
import { User } from 'src/users/user.entity';
import { IsPatient, IsSpecialist } from 'src/users/users.validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsDateString()
  @Column()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  @Column()
  endDate: Date;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column()
  description: string;

  @ApiProperty()
  @OneToOne((type) => Treatment)
  @JoinColumn()
  treatment: Treatment;

  @ApiProperty()
  @ManyToOne((type) => User)
  @Validate(IsPatient)
  patient: User;

  @ApiProperty()
  @ManyToOne((type) => User)
  @Validate(IsSpecialist)
  specialist: User;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Column({ default: false })
  approved: boolean;
}
