import { Injectable, BadRequestException } from '@nestjs/common';
import { google } from 'googleapis';
import { config } from 'dotenv';
import * as admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ConfigService } from '@nestjs/config';

config();

@Injectable()
export class FirebaseAuthService {
  private readonly auth;

  constructor(private readonly configService: ConfigService) {
    const firebaseConfig = {
      apiKey: this.configService.get<string>('firebase.api_key'),
      authDomain: this.configService.get<string>('firebase.auth_domain'),
      projectId: this.configService.get<string>('firebase.projectId'),
      storageBucket: this.configService.get<string>('firebase.storage_bucket'),
      messagingSenderId: this.configService.get<string>(
        'firebase.messaging_sender_id',
      ),
      appId: this.configService.get<string>('firebase.app_id'),
    };

    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
  }

  private async getAccessToken(): Promise<string> {
    const auth = new google.auth.GoogleAuth({
      scopes: [
        'https://www.googleapis.com/auth/firebase',
        'https://www.googleapis.com/auth/identitytoolkit',
      ],
      credentials: {
        type: process.env.TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
      },
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    return accessToken.token;
  }

  async addAuthorizedDomain(domain: string) {
    const ProjectId = process.env.PROJECT_ID;

    const accessToken = await this.getAccessToken();
    const url = `https://identitytoolkit.googleapis.com/admin/v2/projects/${ProjectId}/config`;

    try {
      // 1. Fetch current config
      const getResponse = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!getResponse.ok) {
        throw new Error(`Failed to fetch config: ${await getResponse.text()}`);
      }

      const currentConfig = await getResponse.json();

      // 2. Preserve existing sign-in methods
      const existingSignIn = currentConfig.signIn || {};

      // 3. Update domains
      const updatedDomains = [
        ...new Set([...currentConfig.authorizedDomains, domain]),
      ];

      // 4. Send update with BOTH domains and sign-in config
      const updateResponse = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorizedDomains: updatedDomains,
          signIn: existingSignIn, // Preserve existing providers
        }),
      });

      if (!updateResponse.ok) {
        throw new Error(`Update failed: ${await updateResponse.text()}`);
      }

      return await updateResponse.json();
    } catch (error) {
      throw new Error(`Failed to add domain: ${error.message}`);
    }
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      const user = userCredential.user;

      return {
        user: {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
        },
      };
    } catch (error) {
      // list out possible errors and write a custom error message for each
      if (error.code === 'auth/invalid-credential') {
        throw new BadRequestException('Invalid credentials');
      }
      if (error.code === 'auth/user-not-found') {
        throw new BadRequestException('User not found');
      }
      if (error.code === 'auth/wrong-password') {
        throw new BadRequestException('Wrong password');
      }
      if (error.code === 'auth/invalid-email') {
        throw new BadRequestException('Invalid email');
      }
      if (error.code === 'auth/too-many-requests') {
        throw new BadRequestException('Too many requests');
      }
      if (error.code === 'auth/user-disabled') {
        throw new BadRequestException('User disabled');
      }
      if (error.code === 'auth/missing-password') {
        throw new BadRequestException('Missing password');
      }
      if (error.code === 'auth/missing-email') {
        throw new BadRequestException('Missing email');
      }
      if (error.code === 'auth/invalid-action-code') {
        throw new BadRequestException('Invalid action code');
      }
      if (error.code === 'auth/expired-action-code') {
        throw new BadRequestException('Expired action code');
      }
      throw new BadRequestException(error.message || 'Authentication failed');
    }
  }
}
