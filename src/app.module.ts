import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { MarcasModule } from './Marcas/marcas.module';
import { ProductosModule } from './Productos/productos.module';
import { ArticulosModule } from './Articulos/articulos.module';
import { OrdenesModule } from './Ordenes/ordenes.module'; 
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { EnviosModule } from './envios/envios.module';
import { PagosModule } from './pagos/pagos.modulel';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    ConfigModule.forRoot({ isGlobal: true }), // ✅ importante
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    UsersModule,
    CategoriesModule,
    AuthModule,
    MarcasModule,
    ArticulosModule,
    ProductosModule,
    OrdenesModule,
    EnviosModule,
    PagosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
