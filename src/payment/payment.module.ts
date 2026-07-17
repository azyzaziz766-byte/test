import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Product } from 'src/products/products.entity/products.entity';

@Module({
  imports: [ConfigModule,TypeOrmModule.forFeature([Product]),],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
