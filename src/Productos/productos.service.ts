import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './productos.entity';
import { CreateProductoDto } from './dto/create-productos.dto';
import { UpdateProductoDto } from './dto/update-productos.dto';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class ProductosService {
  productoRepository: any;
  constructor(
    @InjectRepository(Producto)
    productoRepository,
  ) {
    this.productoRepository = productoRepository;
  }

  create(createProductoDto) {
    const producto = this.productoRepository.create(createProductoDto);
    return this.productoRepository.save(producto);
  }

  async findAll(options) {
    const queryBuilder = this.productoRepository.createQueryBuilder('producto');
    return paginate(queryBuilder, options);
  }

  findOne(id) {
    return this.productoRepository.findOne({ where: { id } });
  }

  async update(id, updateProductoDto) {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) return null;
    Object.assign(producto, updateProductoDto);
    return this.productoRepository.save(producto);
  }

  async remove(id) {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) return null;
    return this.productoRepository.remove(producto);
  }
}
