import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import { FileUploadService } from '@root/src/core/upload/upload.service';

type EmailOptions = {
  from?: string;
  replyTo?: string;
  to: string;
  subject: string;
  html: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
};
@Injectable()
export class OtherServiceDependenciesService {
  private readonly orgServerUrl: string;
  private readonly odUrl: string;
  private authToken: string | null = null;

  private readonly emailServerUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.authToken = request['authToken'];
    this.emailServerUrl = this.configService.get<string>(
      'servicesUrl.emailUrl',
    );
  }

  async sendResetPasswordEmail(resetLink: string, email: string) {
    try {
      const emailTemplatePath = path.join(
        process.cwd(),
        'src',
        'core',
        'templates',
        'reset-password-email-template.html',
      );

      let emailHtml = fs.readFileSync(emailTemplatePath, 'utf-8');

      emailHtml = emailHtml.replace('{{reset_link}}', resetLink);
      emailHtml = emailHtml.replace('{{email}}', email);
      emailHtml = emailHtml.replace(
        '{{current_year}}',
        new Date().getFullYear().toString(),
      );

      const emailBody = {
        to: email,
        subject: 'Reset Password Link for Selamnew Workspace',
        html: emailHtml,
      };
      const response = await this.httpService
        .post(`${this.emailServerUrl}/email`, emailBody, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      throw new BadRequestException(`Error Sending Email: ${error.message}`);
    }
  }
}
