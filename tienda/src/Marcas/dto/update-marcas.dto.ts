import { IsOptional, IsString } from 'class-validator';

export class UpdateMarcasDto {
  @IsString()
  @IsOptional()
  nombre?: string;
}