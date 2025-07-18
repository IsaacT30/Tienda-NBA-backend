import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Marcas } from '../Marcas/marcas.entity';
import { Category } from '../categories/category.entity';

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

  @ManyToOne(() => Category, (category) => category.productos, { eager: true, nullable: true })
  categoria?: Category;
}