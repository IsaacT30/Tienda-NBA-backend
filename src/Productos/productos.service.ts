import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './productos.entity';
import { CreateProductoDto } from './dto/create-productos.dto';
import { UpdateProductoDto } from './dto/update-productos.dto';
import { Category } from '../categories/category.entity';
import { Marcas } from '../Marcas/marcas.entity';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class ProductosService {
  productoRepository: Repository<Producto>;
  categoriaRepository: Repository<Category>;
  marcaRepository: Repository<Marcas>;

  constructor(
    @InjectRepository(Producto)
    productoRepository: Repository<Producto>,
    @InjectRepository(Category)
    categoriaRepository: Repository<Category>,
    @InjectRepository(Marcas)
    marcaRepository: Repository<Marcas>,
  ) {
    this.productoRepository = productoRepository;
    this.categoriaRepository = categoriaRepository;
    this.marcaRepository = marcaRepository;
  }

  async create(dto: CreateProductoDto): Promise<Producto> {
    const producto = new Producto();
    producto.nombre = dto.nombre;
    producto.precio = dto.precio;
    if (dto.descripcion !== undefined) producto.descripcion = dto.descripcion;

    if (dto.marca) {
      const marca = await this.marcaRepository.findOneBy({ id: dto.marca });
      if (marca) producto.marca = marca;
    }
    if (dto.categoria) {
      const categoria = await this.categoriaRepository.findOneBy({ id: dto.categoria });
      if (categoria) producto.categoria = categoria;
    }

    return this.productoRepository.save(producto);
  }

  async findAll(options) {
    const queryBuilder = this.productoRepository.createQueryBuilder('producto')
      .leftJoinAndSelect('producto.categoria', 'categoria')
      .leftJoinAndSelect('producto.marca', 'marca');
    return paginate(queryBuilder, options);
  }

  async findOne(id) {
    return this.productoRepository.findOne({
      where: { id },
      relations: ['categoria', 'marca'],
    });
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
