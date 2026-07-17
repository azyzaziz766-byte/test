import { Module } from '@nestjs/common';
import { Product } from './products.entity/products.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [],
  providers: [],
})
export class ProductsModule {}
