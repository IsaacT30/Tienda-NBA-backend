import { Controller,Get,Post,Put,Delete,Body,Param,Query,UseGuards,UploadedFile,UseInterceptors, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductosService } from './productos.service';
import { Request } from 'express';
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
    @UploadedFile() imagen: Express.Multer.File,
    @Body() createProductoDto: CreateProductoDto,
    @Req() req: Request,
  ) {
    // Log para debug de subida de archivos
    console.log('Archivo recibido:', imagen);
    // Si se subió una imagen, guardar el nombre en el DTO
    
    if (imagen) {
      createProductoDto.imagen = imagen.filename;
    }
    const producto = await this.productosService.create(createProductoDto);
    // Devolver la URL completa de la imagen si existe
    if (producto.imagen) {
      const host = req.protocol + '://' + req.get('host');
      return {
        ...producto,
        imagen: `${host}/imagenes/${producto.imagen}`,
      };
    }
    return producto;
  }

  @Get()
  async findAll(@Req() req: Request, @Query('page') page = 1, @Query('limit') limit = 10) {
    const options = { page: Number(page), limit: Number(limit), route: req.protocol + '://' + req.get('host') + req.baseUrl };
    return await this.productosService.findAll(options);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const producto = await this.productosService.findOne(id);
    if (!producto) return null;
    const host = req.protocol + '://' + req.get('host');
    return {
      ...producto,
      imagen: producto.imagen ? `${host}/imagenes/${producto.imagen}` : undefined,
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
