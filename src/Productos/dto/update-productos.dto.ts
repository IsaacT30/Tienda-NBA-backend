import { IsOptional, IsString } from 'class-validator';

export class UpdateProductoDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  categoria?: string; // Nueva propiedad para actualizar la categoría
}
