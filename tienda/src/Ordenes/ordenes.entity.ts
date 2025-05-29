import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity'; 

@Entity('ordenes')
export class Orden {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orden: string;   // <-- Esta columna no puede ser null

  @Column({ type: 'date', nullable: true })
  fecha?: Date;

  @Column({ type: 'decimal' })
  subtotal: number;

  @Column({ type: 'decimal' })
  total: number;

  @Column()
  userId: string;
  
}
