import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ProductsModule } from './modules/products/products.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ProductsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static')
    }),
    CategoriesModule
  ]
})
export class AppModule {}
