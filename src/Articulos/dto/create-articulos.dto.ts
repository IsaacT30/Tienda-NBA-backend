import { IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateArticuloDto {
  @IsString()
  nombre: string;

  @IsNumber()
  precio: number;

  @IsString()
  descripcion: string;

  @IsUUID()
  categoriaId: string;

  @IsUUID()
  marcaId: string;
}