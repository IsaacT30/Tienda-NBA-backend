import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, BadRequestException, UseInterceptors, UploadedFile, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from './enums/user-role.enum';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from './user.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
    create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

@Get()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('isActive') isActive?: string,
  ): Promise<SuccessResponseDto> {
    if (isActive !== undefined && isActive !== 'true' && isActive !== 'false') {
      throw new BadRequestException('Invalid value for "isActive" query param. Use "true" or "false".');
    }
    limit = limit > 100 ? 100 : limit;
    const users = await this.usersService.findAll({ page, limit }, isActive);
    return new SuccessResponseDto('Users retrieved', users);
  }



    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async findOne(@Param('id') id: string) {
      const user = await this.usersService.findOne(+id);
      return new SuccessResponseDto('User retrieved', user);
    }


    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.usersService.update(+id, updateUserDto);
        return new SuccessResponseDto('User updated', user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async remove(@Param('id') id: string) {
        const result = await this.usersService.remove(+id);
        return new SuccessResponseDto('User deleted', result);
    }

    @Put(':id/profile')
    @UseInterceptors(FileInterceptor('profile', {
      storage: diskStorage({
        destination: './public/profile',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        }
      }),
      fileFilter: (req, file, cb) => {
        // Cambia la expresión regular para que acepte image/jpeg y image/png
         if (!file.mimetype.match(/^image\/(jpeg|jpg|png)$/)) {
          return cb(new BadRequestException('Only JPEG, JPG or PNG files are allowed'), false);
        }
        cb(null, true);
      }
    }))
    async uploadProfile(
      @Param('id') id: string,
      @UploadedFile() file: Express.Multer.File,
    ) {
      if (!file) throw new BadRequestException('Profile image is required');
      const user = await this.usersService.updateProfile(+id, file.filename);
      return new SuccessResponseDto('Profile image updated', user);
    }

    // Endpoint para que cualquier usuario autenticado vea su propio perfil
    @Get('me/profile')
    @UseGuards(JwtAuthGuard)
    async getMyProfile(@Request() req) {
      const user = await this.usersService.findOne(req.user.userId);
      return new SuccessResponseDto('User profile retrieved', user);
    }

    // Endpoint para que cualquier usuario autenticado actualice su propio perfil
    @Put('me/profile')
    @UseGuards(JwtAuthGuard)
    async updateMyProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
      // No permitir cambio de rol desde este endpoint
      delete updateUserDto.role;
      const user = await this.usersService.update(req.user.userId, updateUserDto);
      return new SuccessResponseDto('User profile updated', user);
    }

    // Endpoint especial para crear el primer admin (solo en desarrollo)
    @Post('create-admin')
    async createAdmin(@Body() createUserDto: CreateUserDto) {
      // Solo permitir en desarrollo
      if (process.env.NODE_ENV === 'production') {
        throw new ForbiddenException('Este endpoint no está disponible en producción');
      }
      
      // Verificar si ya existe un admin
      const existingAdmin = await this.usersService.findAdminUser();
      if (existingAdmin) {
        throw new BadRequestException('Ya existe un usuario administrador');
      }

      // Forzar rol admin
      createUserDto.role = UserRole.ADMIN;
      const user = await this.usersService.create(createUserDto);
      return new SuccessResponseDto('Admin user created', user);
    }

}


