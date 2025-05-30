import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Articulo } from '../Articulos/articulos.entity';

@Entity('marcas')
export class Marcas {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Articulo, articulo => articulo.marcas)
  articulos: Articulo[];
}