import { IsString, IsDate } from 'class-validator';

export class CrearEnvioDto {
  @IsString()
  idPedido: string;

  @IsString()
  idCliente: string;

  @IsString()
  direccionEnvio: string;

  @IsDate()
  fechaEnvio: Date;

  @IsString()
  transportista: string;

  @IsString()
  estado: string;
}
