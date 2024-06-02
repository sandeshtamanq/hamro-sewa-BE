import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BookingStatus } from '../entities/BookingStatus.Enum';
import { CreateBookingDto } from './CreateBookingDto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @ApiProperty()
  @IsOptional()
  professionalId?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(BookingStatus)
  bookingStatus?: BookingStatus;
}
