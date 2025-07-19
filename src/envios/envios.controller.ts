import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { EnviosService } from './envios.service';
import { CrearEnvioDto } from './dto/crear-envio.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('envios')
export class EnviosController {
  constructor(private readonly service: EnviosService) {}

  @Get()
  async obtenerTodos() {
    const envios = await this.service.obtenerTodos();
    return new SuccessResponseDto('Envíos encontrados', envios);
  }

  @Post()
  async crear(@Body() dto: CrearEnvioDto) {
    const envio = await this.service.crear(dto);
    return new SuccessResponseDto('Envío registrado correctamente', envio);
  }

  @Get(':idPedido')
  async obtenerPorIdPedido(@Param('idPedido') idPedido: string) {
    const envio = await this.service.obtenerPorIdPedido(idPedido);
    return new SuccessResponseDto('Envío encontrado', envio);
  }

  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() dto: CrearEnvioDto) {
    const envio = await this.service.actualizar(id, dto);
    return new SuccessResponseDto('Envío actualizado', envio);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const envio = await this.service.eliminar(id);
    return new SuccessResponseDto('Envío eliminado', envio);
  }
}
