import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './CreatePaymentDto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
