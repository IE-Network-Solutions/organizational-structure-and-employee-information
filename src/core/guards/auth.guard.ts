import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from '@root/src/app/modules/users/user.service';
import admin from '@root/src/config/firebase-admin';

@Injectable()
export class AuthGuard implements CanActivate {
  //constructor(private usersService: UserService) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization;
    const newToken = token.split(' ')[1];

    if (!token) {
      return false;
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(newToken);
      // const oneUSer = await this.usersService.findOne(decodedToken.id);
      request.user = decodedToken;

      return true;
    } catch (error) {
      return false;
    }
  }
}
