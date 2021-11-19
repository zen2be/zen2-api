import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) repo,
    private http: HttpService,
    private jwtService: JwtService,
  ) {
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

  async verifyUser(email: string): Promise<any> {
    const users = await this.repo.find();
    const user = users.find((x) => x.email === email);
    return await this.repo.update(user.id, { verified: true });
  }

  async createVerificationToken(email: string): Promise<string> {
    const payload = { email };
    const token = this.jwtService.sign(payload);
    return token;
  }
}
