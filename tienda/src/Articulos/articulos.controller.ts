import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ArticulosService } from './articulos.service.js';
import { CreateArticuloDto } from './dto/create-articulos.dto';
import { UpdateCategoryDto } from './dto/update-articulos.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Category } from './articulos.entity';

@Controller('articulos')
export class ArticulosController {
    constructor(private readonly categoriesService: ArticulosService) {}

    @Post()
    create(@Body() createCategoryDto: CreateArticuloDto) {
        return this.categoriesService.create(createCategoryDto);
    }

     @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Category>> {
    limit = limit > 100 ? 100 : limit;
    return this.categoriesService.findAll({ page, limit });
  }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
    }