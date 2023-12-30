import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.setupTransporter();
  }
  private async setupTransporter(): Promise<void> {
    this.transporter = nodemailer.createTransport(
      smtpTransport({
        service: this.configService.get<string>('EMAIL_SERVICE', 'Gmail'),
        auth: {
          user: this.configService.get<string>('EMAIL_USER'),
          pass: this.configService.get<string>('EMAIL_PASSWORD'),
        },
      }),
    );
  }

  async sendEmailConfirmation(
    userName: string,
    confirmationLink: string,
    confirmationCode: string,
    toEmail: string,
  ): Promise<void> {
    try {
      const templatePath = path.resolve(
        'src',
        'templates',
        'email-confirmation.html',
      );
      const emailTemplateBuffer = await fs.readFile(templatePath, 'utf-8'); // Асинхронне читання файлу

      const emailTemplate = emailTemplateBuffer.toString(); // Перетворення Buffer у рядок

      const html = emailTemplate
        .replace('{{ userName }}', userName)
        .replace('{{ confirmationLink }}', confirmationLink)
        .replace('{{ confirmationCode }}', confirmationCode);

      const mailOptions: nodemailer.SendMailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to: toEmail,
        subject: 'Email Confirmation',
        html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }
}
