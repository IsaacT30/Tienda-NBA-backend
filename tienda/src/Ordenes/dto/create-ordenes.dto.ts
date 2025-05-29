import { IsArray, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateOrdenDto {
  @IsUUID()
  userId: string;

  @IsArray()
  items: Array<{ articuloId: string; cantidad: number }>;

  @IsString()
  @IsNotEmpty()
  direccionEnvio: string;

  @IsString()
  @IsNotEmpty()
  metodoPago: string;

  @IsNumber()
  subtotal: number;  // ¡Este campo falta!

  @IsNumber()
  total: number;

  @IsString()
  @IsNotEmpty()
  orden: string;
}
