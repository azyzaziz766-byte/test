import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async sendVerificationEmail(email: string, token: string) {
    const url = `http://localhost:3000/auth/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: email,

      subject: 'Verify your account',

      html: `
      <h2>Welcome</h2>

      <p>
      Click below to verify your account
      </p>

      <a href="${url}">
      Verify Email
      </a>
      `,
    });
  }
}
