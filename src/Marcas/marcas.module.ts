import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcasService } from './marcas.service';
import { MarcasController } from './marcas.controller';
import { Marcas } from './marcas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marcas])],
  controllers: [MarcasController],
  providers: [MarcasService],
})
export class MarcasModule {}
