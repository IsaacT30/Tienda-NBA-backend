import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // <- variable desde .env
    });
  }

  async validate(payload: any) {
    return { 
      userId: payload.id, 
      email: payload.email,
      role: payload.role,
      first_name: payload.first_name,
      last_name: payload.last_name
    };
  }
}