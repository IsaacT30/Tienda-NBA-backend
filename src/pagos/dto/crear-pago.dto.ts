import { IsString, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

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

  @Type(() => Date)
  @IsDate()
  fechaPago: Date;
}