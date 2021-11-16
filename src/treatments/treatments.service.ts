import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Treatment } from './treatment.entity';

@Injectable()
export class TreatmentsService extends TypeOrmCrudService<Treatment> {
  constructor(@InjectRepository(Treatment) repo) {
    super(repo);
  }
}
