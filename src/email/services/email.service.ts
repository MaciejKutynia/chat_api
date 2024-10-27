import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailDataInterface } from '../interfaces/email.interface';
import { getEmailContent } from '../utils';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendEmail(data: EmailDataInterface) {
    const { type, emailContentData, ...rest } = data;
    try {
      const html = getEmailContent(type, emailContentData);
      await this.mailerService.sendMail({
        from: 'noreply@mkwsieci.pl',
        html,
        ...rest,
      });
      console.log('E-mail sent successfully');
    } catch (err) {
      console.log('Failed sending e-mail: ' + err);
      return err;
    }
  }
}
