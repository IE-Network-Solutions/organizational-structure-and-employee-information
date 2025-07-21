import { BadRequestException, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';
import * as path from 'path';
import { FirebaseAuthService } from '../../../core/firebaseAuth/firbase-auth.service';
import { UserService } from '../users/services/user.service';

@Injectable()
export class MultiFactorAuthService {
  private readonly emailServerUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly firebaseAuthService: FirebaseAuthService,
    private readonly userService: UserService,
  ) {
    this.emailServerUrl = this.configService.get<string>(
      'servicesUrl.emailUrl',
    );
  }

async send2FACode(email: string, pass: string, tenantId: string) {

    try {
      // Sign in user using FirebaseAuthService
      const signInResult =
        await this.firebaseAuthService.signInWithEmailAndPassword(email, pass);

      if (!signInResult || !signInResult.user.uid) {
        throw new BadRequestException('Invalid email or password');
      }
      // get user detail from the email
      const user = await this.userService.findUserByEmail(
        { email: email },
        tenantId,
      );
      if (!user.is2FAEnabled) {
        return { success: user, is2FAEnabled: false, message: 'Signed in successfully' };
      }

      const uid = signInResult.user.uid;
      const userData = await this.userService.findUserByFirbaseId(uid);

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 5 * 60000); // 5-minute expiry

      // Save to Firestore
      await admin.firestore().collection('2faCodes').doc(uid).set({
        code,
        expires,
        used: false,
      });
      const emailTemplatePath = path.join(
        process.cwd(),
        'src',
        'core',
        'templates',
        'multi-factor-verification-email-template.html',
      );

      let emailHtml = fs.readFileSync(emailTemplatePath, 'utf-8');

      emailHtml = emailHtml.replace('{{verification_code}}', code);
      emailHtml = emailHtml.replace('{{expiry_time}}', '5');
      emailHtml = emailHtml.replace(
        '{{current_year}}',
        new Date().getFullYear().toString(),
      );

      const emailBody = {
        to: email,
        subject: 'Verification Code for Selamnew Workspace',
        html: emailHtml,
      };

      await this.httpService
        .post(`${this.emailServerUrl}/email`, emailBody)
        .toPromise();

      return { uid: uid, message: '2FA code sent successfully' };
    } catch (error) {
      throw error;
    }
  }

  async verify2FACode(uid: string, code: string) {
    try {
      const docRef = admin.firestore().collection('2faCodes').doc(uid);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new BadRequestException('Code expired or invalid');
      }

      const { code: validCode, expires, used } = doc.data()!;
      const now = new Date();

      if (used || now > expires.toDate() || code !== validCode) {
        throw new BadRequestException('Invalid Code');
      }

      // Mark code as used
      const user = await docRef.update({ used: true });

      return { success: user, message: '2FA code verified successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid Code');
    }
  }
}
