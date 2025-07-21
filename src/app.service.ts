import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Esta es mi tienda virtual dedicada a la Nba! ¡Disfruta de la mejor experiencia de compra! with MongoDB y NestJS<br>¡Gracias por visitar!<br>Version: 2025.07.21.11.14<br>Author: Isaac Torres';
  }
}
