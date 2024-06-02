import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CouponCodeRepository } from './CouponCode.Repository';
import { CreateCouponCodeDto } from './dto/CreateCouponCodeDto';
import { UpdateCouponCodeDto } from './dto/UpdateCouponCodeDto';

@Injectable()
export class CouponCodeService {
  constructor(private readonly couponCodeRepository: CouponCodeRepository) {}

  async create(createCouponCodeDto: CreateCouponCodeDto) {
    try {
      const couponCode =
        await this.couponCodeRepository.create(createCouponCodeDto);

      if (!couponCode) throw new BadRequestException('Coupon code not created');

      return couponCode;
    } catch (err) {
      throw new HttpException('Something went wrong', 500);
    }
  }

  async findAll() {
    try {
      const couponCode = await this.couponCodeRepository.findAll();

      if (!couponCode) throw new BadRequestException('Coupon code not created');

      return couponCode;
    } catch (err) {
      throw new HttpException('Something went wrong', 500);
    }
  }

  async findOne(id: number) {
    try {
      const couponCode = await this.couponCodeRepository.findOne(id);

      if (!couponCode) throw new BadRequestException('Coupon code not found');

      return couponCode;
    } catch (err) {
      throw new HttpException('Something went wrong', 500);
    }
  }

  async update(id: number, updateCouponCodeDto: UpdateCouponCodeDto) {
    try {
      const couponCode = await this.couponCodeRepository.findOne(id);

      if (!couponCode) throw new BadRequestException('Coupon code not found');

      const updateCode = await this.couponCodeRepository.update({
        ...couponCode,
        ...updateCouponCodeDto,
      });

      return couponCode;
    } catch (err) {
      throw new HttpException('Something went wrong', 500);
    }
  }

  async check(couponCode: string) {
    try {
      const coupon = await this.couponCodeRepository.check(couponCode);

      if (!coupon) throw new BadRequestException("Coupon doesn't exists");

      return coupon;
    } catch (err) {
      if (err instanceof BadRequestException)
        throw new BadRequestException("Coupon doesn't exists");
      throw new HttpException('Something went wrong', 500);
    }
  }
  async remove(id: number) {
    try {
      const booking = await this.couponCodeRepository.findOne(id);

      if (!booking) throw new NotFoundException();

      await this.couponCodeRepository.softRemove(booking);
    } catch (err) {
      if (err instanceof NotFoundException)
        throw new NotFoundException('Booking not found');
      throw new HttpException('Something went wrong', 500);
    }
  }
}
