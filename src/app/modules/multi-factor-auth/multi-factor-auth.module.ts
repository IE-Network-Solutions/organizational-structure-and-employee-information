import { Module } from '@nestjs/common';
import { MultiFactorAuthService } from './multi-factor-auth.service';
import { MultiFactorAuthController } from './multi-factor-auth.controller';
import { HttpModule } from '@nestjs/axios';
import { FireBaseAuthModule } from '../../../core/firebaseAuth/firebase-auth.module';

@Module({
  imports: [HttpModule, FireBaseAuthModule],
  controllers: [MultiFactorAuthController],
  providers: [MultiFactorAuthService],
})
export class MultiFactorAuthModule {}
