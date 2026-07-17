import { IsInt, IsPositive } from 'class-validator';

export class CreatePaymentDto {

  @IsInt()
  @IsPositive()
  productId: number;


  @IsInt()
  @IsPositive()
  quantity: number;

}