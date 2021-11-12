import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsAscii,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Exclude } from 'class-transformer';

export enum Role {
  Admin = 'admin',
  Specialist = 'specialist',
  Patient = 'patient',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  @Column()
  public firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  @Column()
  public lastName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Column({ unique: true })
  public email: string;

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
  @Column()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('BE')
  @Column()
  tel: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty()
  @IsOptional()
  @Column('text', { default: Role.Patient })
  role: Role;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Column({ default: false })
  verified: boolean;
}
