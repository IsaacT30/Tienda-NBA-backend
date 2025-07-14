import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  precio: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  imagen?: string; 
}