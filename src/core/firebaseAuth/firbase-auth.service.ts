import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { config } from 'dotenv';

config();

@Injectable()
export class FirebaseAuthService {
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
}
