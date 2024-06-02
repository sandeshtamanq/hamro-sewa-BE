import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailService } from '../../infra/mail/Mail.Service';
import { UserTypeParamDto } from '../../lib/utils/UserTypeParamDto';
import { CartItemService } from '../cart-item/CartItem.Service';
import { PaymentService } from '../payment/Payment.Service';
import { PaymentMode } from '../payment/entities/PaymentMode.Enum';
import { ProductService } from '../product/Product.Service';
import { BookingRepository } from './Booking.Repository';
import { CreateBookingDto } from './dto/CreateBookingDto';
import { UpdateBookingDto } from './dto/UpdateBookingDto';
import { BookingStatus } from './entities/BookingStatus.Enum';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly cartItemService: CartItemService,
    private readonly productService: ProductService,
    private readonly paymentService: PaymentService,
    private readonly mailService: MailService,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: number) {
    try {
      if (createBookingDto.bookingItems.length <= 0)
        throw new BadRequestException();
      const newBooking = await this.bookingRepository.create({
        ...createBookingDto,
        userId,
      });

      if (!newBooking) throw new BadRequestException();

      newBooking.bookingItems.map(async (item) => {
        await this.productService.update(item.productId, {
          ...item.product,
          bookings: item.product?.bookings + item.quantity,
        });
      });

      const payment = await this.paymentService.create({
        userId,
        bookingId: newBooking.id,
        paymentMode: createBookingDto.paymentMode,
        priceInCents: String(newBooking.subTotal * 100),
      });

      await this.cartItemService.deleteBy(userId);

      if (createBookingDto.paymentMode === PaymentMode.Online) {
        return payment;
      }

      return newBooking;
    } catch (err) {
      if (err instanceof BadRequestException)
        throw new BadRequestException('Booking Items must be present');
      throw new HttpException('Something went wrong', 500);
    }
  }

  async fetch(userType: UserTypeParamDto, userId: number) {
    try {
      const bookings = await this.bookingRepository.find(userType, userId);
      if (!bookings) throw new NotFoundException();
      bookings.forEach((booking) => {
        if (booking.professional)
          booking.professional.user.fullName = `${booking?.professional?.user.firstName} ${booking?.professional?.user?.middleName ?? ''} ${booking?.professional?.user.lastName}`;
      });
      return bookings;
    } catch (err) {
      throw new HttpException('Something went wrong', 500);
    }
  }

  async deleteMultiple(by: { userId: number }) {
    try {
      const bookings = await this.bookingRepository.findBy({
        userId: by.userId,
      });

      if (!bookings) throw new NotFoundException();
      await this.bookingRepository.deleteMultiple(bookings);
    } catch (err) {
      throw new HttpException('Something went wrong', 500);
    }
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    try {
      const booking = await this.bookingRepository.findOne(id);
      if (!booking) throw new NotFoundException();

      const updateBooking = await this.bookingRepository.update({
        ...booking,
        ...updateBookingDto,
      });

      if (!updateBooking) throw new NotFoundException();

      if (booking.professionalId !== updateBooking.professionalId)
        await this.mailService.bookingAlert(
          booking.user,
          updateBooking.professional,
        );

      if (updateBooking.bookingStatus === BookingStatus.Done) {
        await this.paymentService.updatePaymentStatus({
          bookingId: updateBooking.id,
        });
      }
      return updateBooking;
    } catch (err) {
      throw new HttpException('Something went wrong', 500);
    }
  }

  async remove(id: number) {
    try {
      const booking = await this.bookingRepository.findOne(id);

      if (!booking) throw new NotFoundException();

      await this.bookingRepository.softRemove(booking);
    } catch (err) {
      if (err instanceof NotFoundException)
        throw new NotFoundException('Booking not found');
      throw new HttpException('Something went wrong', 500);
    }
  }

  async findAssigned(id: number) {
    try {
      const booking = await this.bookingRepository.findAssigned(id);

      if (!booking) throw new NotFoundException();

      return booking;
    } catch (err) {
      if (err instanceof NotFoundException)
        throw new NotFoundException('Booking not found');
      throw new HttpException('Something went wrong', 500);
    }
  }
}
