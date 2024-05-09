import { join } from 'path';

import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ProductsModule } from './modules/products/products.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CategoriesModule } from './modules/categories/categories.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductReviewsModule } from './modules/product-reviews/product-reviews.module';
import { FinanceModule } from './modules/finance/finance.module';
import { SharedModule } from './modules/shared/shared.module';
import { DiscountsModule } from './modules/discounts/discounts.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    ProductReviewsModule,
    FinanceModule,
    SharedModule,
    DiscountsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static')
    })
  ]
})
export class AppModule {}
