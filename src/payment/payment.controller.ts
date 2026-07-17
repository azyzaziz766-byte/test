import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';


@Controller('payments')
export class PaymentController {


constructor(
 private readonly paymentService:PaymentService
){}



@Post('checkout')
checkout(
 @Body() dto:CreatePaymentDto
){

 return this.paymentService.checkout(dto);

}

}