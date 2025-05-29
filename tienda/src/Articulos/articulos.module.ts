import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articulo } from './articulos.entity';
import { ArticulosService } from './articulos.service';
import { ArticulosController } from './articulos.controller';
import { Category } from '../categories/category.entity'; // <-- IMPORTA LA ENTIDAD

@Module({
  imports: [
    TypeOrmModule.forFeature([Articulo, Category]) // <-- AGREGA Category AQUÍ
  ],
  controllers: [ArticulosController],
  providers: [ArticulosService],
  exports: [ArticulosService],
})
export class ArticulosModule {}