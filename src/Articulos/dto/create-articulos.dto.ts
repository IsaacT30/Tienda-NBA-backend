import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class CreateArticuloDto {
  @IsString()
  nombre: string;

  @IsNumber()
  precio: number;

  @IsString()
  descripcion: string;

  @IsUUID()
  @IsOptional()
  categoriaId?: string;

  @IsUUID()
  @IsOptional()
  marcaId?: string;
}