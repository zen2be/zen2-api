import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsAscii,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { PasswordIsNotCommonlyUsed } from './users.validator';
import { Appointment } from 'src/appointments/appointment.entity';
import { Treatment } from 'src/treatments/treatment.entity';
import { Timeslot } from 'src/timeslots/timeslot.entity';

export enum Role {
  Admin = 'admin',
  Specialist = 'specialist',
  Patient = 'patient',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  @Column()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  @Column()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Column({ unique: true })
  email: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    const saltOrRounds = 12;
    this.password = await bcrypt.hash(this.password, saltOrRounds);
  }
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8, {
    message:
      'Password is too short (must have at least $constraint1 characters)',
  })
  @IsAscii()
  @Validate(PasswordIsNotCommonlyUsed)
  @Column()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('BE')
  @Column()
  tel: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ enum: () => Role })
  @IsOptional()
  @IsEnum(Role)
  @Column('text', { default: Role.Patient })
  role: Role;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Column({ default: false })
  verified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashRefreshToken(): Promise<void> {
    const saltOrRounds = 10;
    this.refreshToken = await bcrypt.hash(this.refreshToken, saltOrRounds);
  }
  @ApiProperty()
  @Column()
  refreshToken: string;

  @OneToMany(() => Appointment, (appointment) => appointment.patient, {
    onDelete: 'SET NULL',
  })
  patientAppointments: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.specialist, {
    onDelete: 'SET NULL',
  })
  specialistAppointments: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.scheduledBy, {
    onDelete: 'SET NULL',
  })
  scheduledByAppointments: Appointment[];

  @OneToMany(() => Treatment, (treatment) => treatment.specialist, {
    onDelete: 'SET NULL',
  })
  treatments: Treatment[];

  @OneToMany(() => Timeslot, (timeslot) => timeslot.specialist, {
    onDelete: 'SET NULL',
  })
  timeslots: Timeslot[];
}
