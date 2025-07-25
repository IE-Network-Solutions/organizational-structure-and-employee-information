import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseAuthService } from './firbase-auth.service';

@Module({
  imports: [HttpModule],
  providers: [FirebaseAuthService],
  exports: [FirebaseAuthService],
})
export class FireBaseAuthModule {}
