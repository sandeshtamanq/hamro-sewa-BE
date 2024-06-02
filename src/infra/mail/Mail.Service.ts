import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../../core/user/entities/User.Entity';
import { UserProfessional } from '../../core/user/entities/UserProfession.Entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `${process.env.FE_APP}/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Hamro Sewa! Confirm your Email',
      template: './confirmation',
      context: {
        name: user.firstName,
        url,
      },
    });
  }

  async changePassword(user: User, token: string) {
    const url = `${process.env.FE_APP}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset Your Password',
      template: './password-reset',
      context: {
        name: user.firstName,
        url,
      },
    });
  }

  async bookingAlert(user: User, professionalUser: UserProfessional) {
    await this.mailerService.sendMail({
      to: professionalUser.user.email,
      subject: 'Work Assigned',
      template: './booking-alert',
      context: {
        professionalUserName: professionalUser.user.firstName,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        contact: user.contactNumber,
      },
    });
  }
}
