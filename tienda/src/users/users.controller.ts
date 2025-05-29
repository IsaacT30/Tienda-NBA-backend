import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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
  //@UseGuards(JwtAuthGuard)
    create(@Body() createUserDto: CreateUserDto) {
    return new SuccessResponseDto('Users retrieved', User);
  }

@Get()
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
    async findOne(@Param('id') id: string) {
      const user = await this.usersService.findOne(id);
      return new SuccessResponseDto('User retrieved', user);
    }


    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.usersService.findOne(id);
        return new SuccessResponseDto('User retrieved', user);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const user = await this.usersService.findOne(id);
        return this.usersService.remove(id);
        
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
      const user = await this.usersService.updateProfile(id, file.filename);
      return new SuccessResponseDto('Profile image updated', user);
    }

}


