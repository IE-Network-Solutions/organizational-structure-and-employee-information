import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RecaptchaService {
  private readonly recaptchaSecretKey: string;
  private readonly recaptchaVerifyUrl =
    'https://www.google.com/recaptcha/api/siteverify';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.recaptchaSecretKey = this.configService.get<string>(
      'recaptcha.secret_key',
    );
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(this.recaptchaVerifyUrl, null, {
          params: {
            secret: this.recaptchaSecretKey,
            response: token,
          },
        }),
      );

      const { success, score, action } = response.data;
      const SCORE_THRESHOLD = 0.5;

      return success && score >= SCORE_THRESHOLD && action === 'login';
    } catch (error) {
      console.error('reCAPTCHA verification failed:', error);
      return false;
    }
  }
}
