import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { hasRoles } from '../../lib/decorators/Roles.Decorator';
import { JwtAuthGuard } from '../auth/guards/JwtAuth.Guard';
import { RolesGuard } from '../auth/guards/Roles.Guard';
import { UserRole } from '../user/entities/UserRole.Enum';
import { CouponCodeService } from './CouponCode.Service';
import { CreateCouponCodeDto } from './dto/CreateCouponCodeDto';
import { UpdateCouponCodeDto } from './dto/UpdateCouponCodeDto';

@Controller('coupon-codes')
@ApiTags('coupon-codes')
export class CouponCodeController {
  constructor(private readonly couponCodeService: CouponCodeService) {}

  //   @ApiBearerAuth()
  //   @UseGuards(JwtAuthGuard,RolesGuard)
  //   @hasRoles(UserRole.Admin)
  //   @Post()
  //   create(@Body() createCouponCodeDto:CreateCouponCodeDto){
  //     return this.couponCodeService.get(createCouponCodeDto)
  //   }

  @ApiBearerAuth()
  @hasRoles(UserRole.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createCouponCodeDto: CreateCouponCodeDto) {
    return this.couponCodeService.create(createCouponCodeDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(UserRole.Admin)
  @Get()
  fetch() {
    return this.couponCodeService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(UserRole.Admin)
  @Get(':id')
  fetchOne(@Param('id', ParseIntPipe) id: number) {
    return this.couponCodeService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(UserRole.Admin)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCouponCodeDto: UpdateCouponCodeDto,
  ) {
    return this.couponCodeService.update(id, updateCouponCodeDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(UserRole.User)
  @Post('check')
  checkCoupon(@Body('couponCode') couponCode: string) {
    return this.couponCodeService.check(couponCode);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(UserRole.Admin)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.couponCodeService.remove(id);
  }
}
