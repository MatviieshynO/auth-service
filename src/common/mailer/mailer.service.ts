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
    // Initialize the transporter when the service instance is created
    this.setupTransporter();
  }

  // Asynchronous method for setting up the transporter
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

  // ********************************
  // Sending email confirmation
  // ********************************

  async sendEmailConfirmation(
    userName: string,
    confirmationLink: string,
    confirmationCode: string,
    toEmail: string,
  ): Promise<void> {
    try {
      // Define the path to the email template
      const templatePath = path.resolve(
        'src',
        'templates',
        'email-confirmation.html',
      );

      // Asynchronously read the content of the email template as a buffer
      const emailTemplateBuffer = await fs.readFile(templatePath, 'utf-8');

      // Convert the buffer to a string
      const emailTemplate = emailTemplateBuffer.toString();

      // Variables in the email template with actual values
      const html = emailTemplate
        .replace('{{ userName }}', userName)
        .replace('{{ confirmationLink }}', confirmationLink)
        .replace('{{ confirmationCode }}', confirmationCode);

      // Create the configuration object for the email
      const mailOptions: nodemailer.SendMailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to: toEmail,
        subject: 'Email Confirmation',
        html,
      };

      // Send the email using the transporter
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }
}
