import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Marcas } from '../Marcas/marcas.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column()
  descripcion: string;

  @ManyToOne(() => Marcas, marcas => marcas.articulos)
  marca: Marcas;
}