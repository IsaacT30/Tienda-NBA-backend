
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Articulo, Category } from './articulos.entity';
import { CreateArticuloDto } from './dto/create-articulos.dto';
import { UpdateCategoryDto } from './dto/update-articulos.dto';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class ArticulosService {
    constructor(
        @InjectRepository(Articulo)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    create(CreateArticuloDto: CreateArticuloDto) {
        const category = this.categoryRepository.create(CreateArticuloDto);
        return this.categoryRepository.save(category);
    }

     async findAll(options: IPaginationOptions): Promise<Pagination<Category>> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');
    return paginate<Category>(queryBuilder, options);
  }

    findOne(id: string) {
        return this.categoryRepository.findOne({ where: { id } });
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) return null;
        Object.assign(category, updateCategoryDto);
        return this.categoryRepository.save(category);
    }

    async remove(id: string) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) return null;
        return this.categoryRepository.remove(category);
    }
    }