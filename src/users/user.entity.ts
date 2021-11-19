import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
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

  @ApiProperty()
  @IsOptional()
  @IsEnum(Role)
  @Column('text', { default: Role.Patient })
  role: Role;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Column({ default: false })
  verified: boolean;
}
