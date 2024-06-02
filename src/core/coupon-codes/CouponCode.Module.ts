import { Module } from '@nestjs/common';
import { CouponCodeController } from './CouponCode.Controller';
import { CouponCodeRepository } from './CouponCode.Repository';
import { CouponCodeService } from './CouponCode.Service';
import { CouponCodeDIToken } from './CouponCodeDIToken';

@Module({
  imports: [CouponCodeDIToken.couponCodeEntity],
  controllers: [CouponCodeController],
  providers: [CouponCodeService, CouponCodeRepository],
})
export class CouponCodeModule {}
