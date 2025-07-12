import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Pago extends Document {
  @Prop({ required: true })
  idPedido: string; // Relación con el pedido realizado

  @Prop({ required: true })
  idCliente: string; // Relación con el cliente

  @Prop({ required: true })
  metodoPago: string; // Ej: "Tarjeta de Crédito", "PayPal", "Transferencia"

  @Prop({ required: true })
  monto: number; // Monto total del pago

  @Prop({ default: 'Pendiente' })
  estado: string; // Ej: "Pendiente", "Completado", "Fallido"

  @Prop()
  fechaPago: Date; // Fecha y hora del pago
}

export const PagoSchema = SchemaFactory.createForClass(Pago);
