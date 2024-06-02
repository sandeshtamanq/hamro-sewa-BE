import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCouponCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  couponCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  discountPrice: string;

  @ApiProperty()
  @IsOptional()
  validFor?: number;
}
