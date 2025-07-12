import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MarcasService } from './marcas.service';
import { CreateMarcasDto } from './dto/create-marcas.dto';
import { UpdateMarcasDto } from './dto/update-marcas.dto'; // <-- Cambia aquí
import { Pagination } from 'nestjs-typeorm-paginate';
import { Marcas } from './marcas.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('marcas')
export class MarcasController {    
  constructor(private readonly marcasService: MarcasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateMarcaDto: UpdateMarcasDto) { // <-- Cambia aquí
    return this.marcasService.update(id, updateMarcaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcasService.remove(id);
  }
}