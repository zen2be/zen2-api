import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min, Validate } from 'class-validator';
import { IsSpecialist } from 'src/users/users.validator';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Treatment {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @ManyToOne((type) => User)
  @Validate(IsSpecialist)
  specialist: User;

  @ApiProperty()
  @IsString()
  @Column({ unique: true })
  name: string;

  @ApiProperty()
  @IsString()
  @Column()
  description: string;

  @ApiProperty()
  @IsNumber()
  @Column()
  duration: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column()
  price: number;
}
