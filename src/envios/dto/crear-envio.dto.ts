import { IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearEnvioDto {
  @IsString()
  idPedido: string;

  @IsString()
  idCliente: string;

  @IsString()
  direccionEnvio: string;

  @Type(() => Date)
  @IsDate()
  fechaEnvio: Date;

  @IsString()
  transportista: string;

  @IsString()
  estado: string;
}