import { Inject, Injectable } from '@nestjs/common';
import * as mg from 'mailgun-js';

@Injectable()
export class MailService {
  constructor(
    @Inject('MAIL_API_KEY') private readonly MAIL_API_KEY: string,
    @Inject('MAIL_DOMAIN') private readonly MAIL_DOMAIN: string,
  ) {}

  generatedCode(): number {
    return Math.floor(Math.random() * 100000);
  }

  sendMail() {
    const code = this.generatedCode();

    const mailData = {
      from: 'chiwon99881@gmail.com',
      to: 'chiwon99881@gmail.com',
      subject: 'Coupang-Eats Verification Code',
      text: `Get this code your verified ${code}`,
      html: `<html>Get this code your verified <h3>${code}<h3></html>`,
    };
    const mailgun = new mg({
      apiKey: this.MAIL_API_KEY,
      domain: this.MAIL_DOMAIN,
    });
    mailgun.messages().send(mailData, (error, body) => {
      console.log(body, error);
    });
  }
}
