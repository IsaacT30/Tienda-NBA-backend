import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  @IsNumber()
  precio: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsString()
  categoria?: string; // o el tipo que uses para la relación

  @IsOptional()
  @IsString()
  marca?: string; // o el tipo que uses para la relación
}