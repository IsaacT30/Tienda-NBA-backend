import { IsString, IsNumber } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsNumber()
  precio: number;

  @IsString()
  descripcion: string;
}