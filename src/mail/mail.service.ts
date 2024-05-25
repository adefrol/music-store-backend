import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer'
import StreamTransport from 'nodemailer/lib/stream-transport'
import { from } from 'rxjs'
import { RecoveryTemplate, RegisterTemplate } from './templates/templates'

@Injectable()
export class MailService {
    constructor(
        private readonly mailService: MailerService
    ) {}

    async sendMailRegister(email: string, code: string) {
        return this.mailService.sendMail({
            from: 'MUSIC STORE DO-NOT-REPLY <music-store-no-reply@yandex.ru>',
            to: email,
            subject: `Спасибо за регистрацию!`,
            html: `${RegisterTemplate(code)}`,
          });
    }

    async sendMailRecovery(email: string, code: string) {
        return this.mailService.sendMail({
            from: 'MUSIC STORE DO-NOT-REPLY <music-store-no-reply@yandex.ru>',
            to: email,
            subject: `Восстановление пароля`,
            html: `${RecoveryTemplate(code)}`,
          });
    }
}
