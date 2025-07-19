import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Envio } from './schemas/envio.schema';
import { CrearEnvioDto } from './dto/crear-envio.dto';

@Injectable()
export class EnviosService {
  constructor(
    @InjectModel(Envio.name) private readonly envioModel: Model<Envio>,
  ) {}

  async obtenerTodos(): Promise<Envio[]> {
    try {
      return await this.envioModel.find().exec();
    } catch (err) {
      console.error('Error al obtener todos los envíos:', err);
      return [];
    }
  }

  async crear(dto: CrearEnvioDto): Promise<Envio | null> {
    try {
      const envio = new this.envioModel(dto);
      return await envio.save();
    } catch (err) {
      console.error('Error al crear envío:', err);
      return null;
    }
  }

  async obtenerPorIdPedido(idPedido: string): Promise<Envio | null> {
    try {
      return await this.envioModel.findOne({ idPedido }).exec();
    } catch (err) {
      console.error('Error al obtener envío por pedido:', err);
      return null;
    }
  }

  async actualizar(id: string, dto: CrearEnvioDto): Promise<Envio | null> {
    try {
      return await this.envioModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    } catch (err) {
      console.error('Error al actualizar envío:', err);
      return null;
    }
  }

  async eliminar(id: string): Promise<Envio | null> {
    try {
      return await this.envioModel.findByIdAndDelete(id).exec();
    } catch (err) {
      console.error('Error al eliminar envío:', err);
      return null;
    }
  }
}
