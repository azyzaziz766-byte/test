import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import Stripe from 'stripe';

import { Product } from 'src/products/products.entity/products.entity';

import { CreatePaymentDto } from './dto/create-payment.dto';


@Injectable()
export class PaymentService {

  private readonly stripe: Stripe;

  private readonly logger =
    new Logger(PaymentService.name);



  constructor(private readonly configService: ConfigService,@InjectRepository(Product) private readonly productRepository:Repository<Product>,) {

    this.stripe = new Stripe(
      this.configService.getOrThrow<string>(
        'STRIPE_SECRET_KEY'
      )
    );}



  async checkout(
    createPaymentDto: CreatePaymentDto,
  ) {
      const product =await this.findProduct(createPaymentDto.productId);
      const amount =this.calculateAmount(product.price,createPaymentDto.quantity);
      this.logger.log(
      `Creating payment for product ${product.id} ${ this.configService.getOrThrow<string>(
        'STRIPE_SECRET_KEY'
      )}`
      );



    const paymentIntent =await this.createStripePayment(amount,product.id,createPaymentDto.quantity);
    return {
      clientSecret:
        paymentIntent.client_secret,
        amount,
    };
 }




  private async findProduct(productId:number)
  {   
    const product =await this.productRepository.findOneBy({id: productId,});
    if(!product){
    throw new NotFoundException('Product not found');
    }
    return product;
  }
  private calculateAmount(price:number,quantity:number) 
  {
   return price * quantity;
  }
private async createStripePayment(
  amount:number,
  productId:number,
  quantity:number,
) {

  try {

    return await this.stripe.paymentIntents.create({

      amount: amount * 100,

      currency:'usd',

      metadata:{
        productId:String(productId),
        quantity:String(quantity),
      },

    });


  } catch(error) {

    console.log('STRIPE ERROR 👉', error);

    throw error;

  }

}
}