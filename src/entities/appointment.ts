import { Treatment } from './treatment.js'
import { User } from './user.js'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  startDate: Date

  @Column()
  endDate: Date

  @Column()
  title: string

  @Column()
  description: string

  @OneToOne((type) => Treatment)
  @JoinColumn()
  treatment: Treatment

  @ManyToOne((type) => User)
  patient: User

  @ManyToOne((type) => User)
  doctor: User
}
