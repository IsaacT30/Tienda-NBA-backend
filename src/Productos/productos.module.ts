import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './productos.entity';
import { Category } from '../categories/category.entity';
import { Marcas } from '../Marcas/marcas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Category, Marcas])],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
