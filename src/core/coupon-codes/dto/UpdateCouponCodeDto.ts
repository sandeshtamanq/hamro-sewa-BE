import { PartialType } from '@nestjs/swagger';
import { CreateCouponCodeDto } from './CreateCouponCodeDto';

export class UpdateCouponCodeDto extends PartialType(CreateCouponCodeDto) {}
