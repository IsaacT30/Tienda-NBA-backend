import * as nodemailer from 'nodemailer';
import * as sgMail from '@sendgrid/mail';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';
import axios from 'axios';

@Injectable()
export class MailService {
constructor() {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new InternalServerErrorException('La variable de entorno SENDGRID_API_KEY no está definida');
  }
  sgMail.setApiKey(apiKey);
}

  async sendWithSendGrid(dto: SendMailDto) {
  const sender = process.env.SENDGRID_SENDER;
  if (!sender) {
    throw new InternalServerErrorException('La variable de entorno SENDGRID_SENDER no está definida');
  }
  const msg = {
    to: dto.to,
    from: sender,
    subject: dto.subject,
    html: dto.message,
  };

  try {
    const response = await sgMail.send(msg);
    return { message: 'Correo enviado', response: response[0].statusCode };
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  }
}

  async sendMail(dto: SendMailDto) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: dto.to,
        subject: dto.subject,
        html: dto.message,
      });
      return { messageId: info.messageId };
    } catch (error) {
      throw new InternalServerErrorException('No se pudo enviar el correo');
    }
  }

  async fetchUserListFromPublicApi() {
    const res = await axios.get('https://jsonplaceholder.typicode.com/users');
    return res.data;
  }
}