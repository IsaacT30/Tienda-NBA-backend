import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { Orden } from './ordenes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orden])],
  controllers: [OrdenesController],
  providers: [OrdenesService],
})
export class OrdenesModule {}
