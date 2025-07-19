
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pago } from './schemas/pago.schema';
import { CrearPagoDto } from './dto/crear-pago.dto';

@Injectable()
export class PagosService {
  constructor(
    @InjectModel(Pago.name) private readonly pagoModel: Model<Pago>,
  ) {}

  async obtenerTodos(): Promise<Pago[]> {
    try {
      return await this.pagoModel.find().exec();
    } catch (err) {
      console.error('Error al obtener todos los pagos:', err);
      return [];
    }
  }

  async crear(dto: CrearPagoDto): Promise<Pago | null> {
    try {
      const pago = new this.pagoModel(dto);
      return await pago.save();
    } catch (err) {
      console.error('Error al crear pago:', err);
      return null;
    }
  }

  async obtenerPorIdPedido(idPedido: string): Promise<Pago | null> {
    try {
      return await this.pagoModel.findOne({ idPedido }).exec();
    } catch (err) {
      console.error('Error al obtener pago por pedido:', err);
      return null;
    }
  }

  async actualizar(id: string, dto: CrearPagoDto): Promise<Pago | null> {
    try {
      return await this.pagoModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    } catch (err) {
      console.error('Error al actualizar pago:', err);
      return null;
    }
  }

  async eliminar(id: string): Promise<Pago | null> {
    try {
      return await this.pagoModel.findByIdAndDelete(id).exec();
    } catch (err) {
      console.error('Error al eliminar pago:', err);
      return null;
    }
  }
}
