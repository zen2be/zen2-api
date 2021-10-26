import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Treatment {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  duration: number
}
