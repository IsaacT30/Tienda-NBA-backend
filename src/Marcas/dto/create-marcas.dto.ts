import { IsString } from 'class-validator';

export class CreateMarcasDto {
  @IsString()
  nombre: string;
}
