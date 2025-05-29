import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { MarcasService } from './marcas.service';
import { CreateMarcasDto } from './dto/create-marcas.dto';
import { UpdateMarcasDto } from './dto/update-marcas.dto'; // <-- Cambia aquí
import { Pagination } from 'nestjs-typeorm-paginate';
import { Marcas } from './marcas.entity';

@Controller('marcas')
export class MarcasController {    
  constructor(private readonly marcasService: MarcasService) {}

  @Post()
  create(@Body() createMarcaDto: CreateMarcasDto) {
    return this.marcasService.create(createMarcaDto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Marcas>> {
    limit = limit > 100 ? 100 : limit;
    return this.marcasService.findAll({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcasService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMarcaDto: UpdateMarcasDto) { // <-- Cambia aquí
    return this.marcasService.update(id, updateMarcaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcasService.remove(id);
  }
}