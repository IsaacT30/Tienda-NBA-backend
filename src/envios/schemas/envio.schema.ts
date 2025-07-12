import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Envio extends Document {
  @Prop({ required: true })
  idPedido: string; // Relación con el pedido realizado

  @Prop({ required: true })
  idCliente: string; // Relación con el cliente

  @Prop({ required: true })
  direccionEnvio: string; // Dirección a donde se enviará el artículo

  @Prop({ required: true })
  fechaEnvio: Date; // Fecha de envío

  @Prop({ required: true })
  transportista: string; // Ej: "DHL", "FedEx", "Correos"

  @Prop({ default: 'Pendiente' })
  estado: string; // Ej: "Pendiente", "Enviado", "Entregado"
}

export const EnvioSchema = SchemaFactory.createForClass(Envio);
