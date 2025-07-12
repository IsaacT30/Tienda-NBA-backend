import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnviosController } from './envios.controller';
import { EnviosService } from './envios.service';
import { Envio, EnvioSchema } from './schemas/envio.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Envio.name, schema: EnvioSchema }])],
  controllers: [EnviosController],
  providers: [EnviosService],
})
export class EnviosModule {}
