import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();

    const isExcluded = this.reflector.get<boolean>('hasExcludedToken', handler);
    if (isExcluded) {
      return true;
    }
    const token = request.headers.authorization;
    const newToken = token.split(' ')[1];

    if (!token) {
      return false;
    }

    try {
      // const decodedToken = await admin.auth().verifyIdToken(newToken);
      const decodedToken = await admin.auth().verifyIdToken(newToken, true);
      // This ensures Firebase checks whether the token was revoked.
      // If revoked, the request is rejected immediately.
      request.user = decodedToken;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
