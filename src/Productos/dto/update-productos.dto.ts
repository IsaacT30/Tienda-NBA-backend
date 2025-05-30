import { IsOptional, IsString } from 'class-validator';

export class UpdateProductoDto {
  @IsString()
  @IsOptional()
  name?: string;
}
