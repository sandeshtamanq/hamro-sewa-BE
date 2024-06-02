import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';
import { Response } from 'express';
import { CurrentUser } from '../../lib/decorators/CurrentUser.Decorator';
import { User } from '../user/entities/User.Entity';
import { AuthService } from './Auth.Service';
import { ChangePasswordDto } from './dto/ChangepasswordDto';
import { ForgotPasswordDto } from './dto/ForgotPasswordDto';
import { LogInDto } from './dto/LoginDto';
import { ResetPasswordDto } from './dto/ResetpasswordDto';
import { SignUpDto } from './dto/SignUpDto';
import { VerifyEmailDto } from './dto/VerifyEmailDto';
import { JwtAuthGuard } from './guards/JwtAuth.Guard';
import { LocalAuthGuard } from './guards/LocalAuth.Guard';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LogInDto })
  async login(@Req() req: any, @Res() response: Response) {
    const data: { user: User; token: string } = await this.authService.login(
      req.user,
    );

    const userResponse = instanceToPlain(data);

    response
      .cookie('token', data.token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        sameSite: 'none',
      })
      .send({
        ...userResponse.user,
      });
  }

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Patch('reset-password')
  async resetPassword(@Body() resetpasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetpasswordDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() userId: number,
  ) {
    return this.authService.changePassword(changePasswordDto, userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  async logout(@Res() response: Response) {
    response.clearCookie('token').send();
  }
}
