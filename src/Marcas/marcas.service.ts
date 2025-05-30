import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marcas } from './marcas.entity';
import { CreateMarcasDto } from './dto/create-marcas.dto';
import { UpdateMarcasDto } from './dto/update-marcas.dto';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class MarcasService {
  constructor(
    @InjectRepository(Marcas)
    private readonly marcasRepository: Repository<Marcas>,
  ) {}

  create(createMarcaDto: CreateMarcasDto) {
    const marca = this.marcasRepository.create(createMarcaDto as Partial<Marcas>);
    return this.marcasRepository.save(marca);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Marcas>> {
    const queryBuilder = this.marcasRepository.createQueryBuilder('marca');
    return paginate<Marcas>(queryBuilder, options);
  }

  findOne(id: string) {
    return this.marcasRepository.findOne({ where: { id } });
  }

  async update(id: string, updateMarcaDto: UpdateMarcasDto) {
    const marca = await this.marcasRepository.findOne({ where: { id } });
    if (!marca) return null;
    Object.assign(marca, updateMarcaDto);
    return this.marcasRepository.save(marca);
  }

  async remove(id: string) {
    const marca = await this.marcasRepository.findOne({ where: { id } });
    if (!marca) return null;
    return this.marcasRepository.remove(marca);
  }
}