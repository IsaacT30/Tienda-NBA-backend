import { Injectable, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orden } from './ordenes.entity';
import { CreateOrdenDto } from './dto/create-ordenes.dto';
import { UpdateOrdenDto } from './dto/update-ordenes.dto';
import { UserRole } from '../users/enums/user-role.enum';
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

  async findByUserId(userId: number, options: IPaginationOptions): Promise<Pagination<Orden>> {
    try {
      const queryBuilder = this.ordenRepository
        .createQueryBuilder('orden')
        .where('orden.userId = :userId', { userId });
      return await paginate<Orden>(queryBuilder, options);
    } catch (error) {
      console.error(`Error obteniendo órdenes del usuario ${userId}:`, error);
      throw new InternalServerErrorException('Error interno al obtener órdenes del usuario');
    }
  }

  async findOne(id: string, user?: any) {
    try {
      const orden = await this.ordenRepository.findOne({ where: { id } });
      if (!orden) {
        throw new NotFoundException('Orden no encontrada');
      }

      // Si el usuario no es admin, solo puede ver sus propias órdenes
      if (user && user.role !== UserRole.ADMIN && orden.userId !== user.userId) {
        throw new ForbiddenException('No tienes permisos para ver esta orden');
      }

      return orden;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
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
