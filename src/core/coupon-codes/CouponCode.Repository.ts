import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CouponCode } from './entities/CouponCode.Entity';

@Injectable()
export class CouponCodeRepository {
  constructor(
    @InjectRepository(CouponCode)
    private readonly repository: Repository<CouponCode>,
  ) {}

  async create(couponCode: Partial<CouponCode>) {
    try {
      const newCouponCode = await this.repository.save(
        this.repository.create(couponCode),
      );
      if (!newCouponCode) return null;

      return newCouponCode;
    } catch (err) {
      return null;
    }
  }

  async findAll() {
    return this.repository.createQueryBuilder('cc').getMany();
  }

  async findOne(id: number) {
    return this.repository
      .createQueryBuilder('cc')
      .where('cc.id = :id', { id })
      .getOne();
  }

  async update(booking: Partial<CouponCode>) {
    try {
      const preloaded = await this.repository.preload({ ...booking });
      const update = await this.repository.save({ ...preloaded });
      if (!update) return null;

      return this.findOne(update.id);
    } catch (err) {
      return null;
    }
  }

  async check(couponCode: string) {
    return this.repository
      .createQueryBuilder('cc')
      .where('cc.couponCode = :couponCode', { couponCode })
      .getOne();
  }

  async softRemove(booking: Partial<CouponCode>) {
    await this.repository.softRemove(booking);
  }
}
