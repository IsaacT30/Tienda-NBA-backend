import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Marcas } from '../Marcas/marcas.entity';

@Entity('articulos')
export class Articulo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column()
  descripcion: string;

  @ManyToOne(() => Category, category => category.articulos)
  category: Category;

  @ManyToOne(() => Marcas, seccion => seccion.articulos)
  seccion: Marcas;
  marcas: any;
}

export { Category };
