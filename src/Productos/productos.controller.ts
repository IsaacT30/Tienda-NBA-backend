import { Controller,Get,Post,Put,Delete,Body,Param,Query,UseGuards,UploadedFile,UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-productos.dto';
import { UpdateProductoDto } from './dto/update-productos.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './public/imagenes',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductoDto: CreateProductoDto,
  ) {
    // Si se subió una imagen, guardar el nombre en el DTO
    let imagen = createProductoDto.imagen;
    if (file) {
      imagen = file.filename;
    }
    const producto = await this.productosService.create({
      ...createProductoDto,
      imagen,
    });
    // Devolver la URL completa de la imagen si existe
    if (producto.imagen) {
      return {
        ...producto,
        imagen: `${process.env.HOST_URL || ''}/public/imagenes/${producto.imagen}`,
      };
    }
    return producto;
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    const result = await this.productosService.findAll({ page, limit });
    // Si usas paginación, clona el objeto y mapea los items
    if (result.items) {
      return {
        ...result,
        items: result.items.map(producto => ({
          ...producto,
          imagen: producto.imagen
            ? `${process.env.HOST_URL || 'http://localhost:3050'}/public/imagenes/${producto.imagen}`
            : null,
        })),
      };
    }
    // Si no usas paginación, solo es un array
    return Array.isArray(result)
      ? result.map(producto => ({
          ...producto,
          imagen: producto.imagen
            ? `${process.env.HOST_URL || 'http://localhost:3050'}/public/imagenes/${producto.imagen}`
            : null,
        }))
      : result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const producto = await this.productosService.findOne(id);
    if (!producto) return null;
    return {
      ...producto,
      imagen: producto.imagen
        ? `${process.env.HOST_URL || 'http://localhost:3050'}/public/imagenes/${producto.imagen}`
        : null,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.productosService.remove(id);
  }
}
