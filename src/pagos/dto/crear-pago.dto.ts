import { IsString, IsNumber, IsDate } from 'class-validator';

export class CrearPagoDto {
  @IsString()
  idPedido: string;

  @IsString()
  idCliente: string;

  @IsString()
  metodoPago: string;

  @IsNumber()
  monto: number;

  @IsString()
  estado: string;

  @IsDate()
  fechaPago: Date;
}
