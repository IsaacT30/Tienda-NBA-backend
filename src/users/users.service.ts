import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enums/user-role.enum';
import * as bcrypt from 'bcrypt';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async findAll(options: IPaginationOptions, isActive: string | undefined): Promise<Pagination<User>> {
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      return paginate<User>(queryBuilder, options);
    }


  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    return this.userRepository.remove(user);
  }

  async updateProfile(id: number, profile: string) {
  const user = await this.userRepository.findOne({ where: { id: id } });
  if (!user) throw new NotFoundException('User not found');
  user.profile = profile;
  return this.userRepository.save(user);
}

  async findAdminUser() {
    return this.userRepository.findOne({ 
      where: { role: UserRole.ADMIN } 
    });
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    await this.userRepository.update(userId, { refresh_token: refreshToken });
  }

  async findByRefreshToken(refreshToken: string) {
    return this.userRepository.findOne({ where: { refresh_token: refreshToken } });
  }
}