import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orden } from './ordenes.entity';
import { CreateOrdenDto } from './dto/create-ordenes.dto';
import { UpdateOrdenDto } from './dto/update-ordenes.dto';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class OrdenesService {
  constructor(
    @InjectRepository(Orden)
    private readonly ordenRepository: Repository<Orden>,
  ) {}

  async create(createOrdenDto: CreateOrdenDto) {
    try {
      const orden = this.ordenRepository.create(createOrdenDto);
      return await this.ordenRepository.save(orden);
    } catch (error) {
      console.error('Error creando orden:', error);
      // Puedes lanzar un error HTTP 500 con mensaje genérico
      throw new InternalServerErrorException('Error interno al crear orden');
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Orden>> {
    try {
      const queryBuilder = this.ordenRepository.createQueryBuilder('orden');
      return await paginate<Orden>(queryBuilder, options);
    } catch (error) {
      console.error('Error obteniendo órdenes:', error);
      throw new InternalServerErrorException('Error interno al obtener órdenes');
    }
  }

  async findOne(id: string) {
    try {
      return await this.ordenRepository.findOne({ where: { id } });
    } catch (error) {
      console.error(`Error buscando orden con id ${id}:`, error);
      throw new InternalServerErrorException('Error interno al buscar orden');
    }
  }

  async update(id: string, updateOrdenDto: UpdateOrdenDto) {
    try {
      const orden = await this.ordenRepository.findOne({ where: { id } });
      if (!orden) return null;
      Object.assign(orden, updateOrdenDto);
      return await this.ordenRepository.save(orden);
    } catch (error) {
      console.error(`Error actualizando orden con id ${id}:`, error);
      throw new InternalServerErrorException('Error interno al actualizar orden');
    }
  }

  async remove(id: string) {
    try {
      const orden = await this.ordenRepository.findOne({ where: { id } });
      if (!orden) return null;
      return await this.ordenRepository.remove(orden);
    } catch (error) {
      console.error(`Error eliminando orden con id ${id}:`, error);
      throw new InternalServerErrorException('Error interno al eliminar orden');
    }
  }
}
