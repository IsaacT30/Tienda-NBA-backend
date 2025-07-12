import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CrearPagoDto } from './dto/crear-pago.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('pagos')
export class PagosController {
  constructor(private readonly service: PagosService) {}

  @Post()
  async crear(@Body() dto: CrearPagoDto) {
    const pago = await this.service.crear(dto);
    return new SuccessResponseDto('Pago registrado correctamente', pago);
  }

  @Get(':idPedido')
  async obtenerPorIdPedido(@Param('idPedido') idPedido: string) {
    const pago = await this.service.obtenerPorIdPedido(idPedido);
    return new SuccessResponseDto('Pago encontrado', pago);
  }

  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() dto: CrearPagoDto) {
    const pago = await this.service.actualizar(id, dto);
    return new SuccessResponseDto('Pago actualizado', pago);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const pago = await this.service.eliminar(id);
    return new SuccessResponseDto('Pago eliminado', pago);
  }
}
