import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Role } from './role'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  createdAt: Date

  @ManyToOne((type) => Role)
  role: Role

  @Column()
  verified: boolean
}
