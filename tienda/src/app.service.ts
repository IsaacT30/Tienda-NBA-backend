import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Esta es mi tienda virtual dedicada a la Nba!';
  }
}
