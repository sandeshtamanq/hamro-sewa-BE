import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { CoreEntity } from '../../../lib/utils/Base.Entity';

@Entity('coupon-codes')
export class CouponCode extends CoreEntity {
  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  couponCode: string;

  @ApiProperty()
  @Column({ type: 'int', default: 1 })
  validFor: number;

  @ApiProperty()
  @Column({ type: 'varchar' })
  discountPrice: string;

  @BeforeInsert()
  capitalizeCoupon(): void {
    this.couponCode = this.couponCode.toUpperCase();
  }
}
