import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponCode } from './entities/CouponCode.Entity';

export class CouponCodeDIToken {
  static readonly couponCodeEntity = TypeOrmModule.forFeature([CouponCode]);
}
