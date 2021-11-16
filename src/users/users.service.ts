import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) repo) {
    super(repo);
  }

  async findByEmail(email: string): Promise<any> {
    const users = await this.repo.find();
    return users.find((x) => x.email === email);
  }

  async getPatients(): Promise<any> {
    const users = await this.repo.find();
    return users.find((u) => u.role === 'patient');
  }
}
