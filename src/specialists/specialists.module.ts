import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { SpecialistsController } from './specialists.controller';
import { SpecialistsService } from './specialists.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SpecialistsController],
  providers: [SpecialistsService],
})
export class SpecialistsModule {}
