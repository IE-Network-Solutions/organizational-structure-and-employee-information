import { Controller, Post, Body } from '@nestjs/common';
import { MultiFactorAuthService } from './multi-factor-auth.service';
import { ExcludeTenantGuard } from '@root/src/core/guards/exclud.guard';
import { ExcludeAuthGuard } from '@root/src/core/guards/exclud.guard';
import { Send2FACodeDto } from './dto/send-2fa-code.dto';
import { Verify2FACodeDto } from './dto/verify-2fa-code.dto';

@Controller('multi-factor-auth')
export class MultiFactorAuthController {
  constructor(
    private readonly multiFactorAuthService: MultiFactorAuthService,
  ) {}
  @Post()
  @ExcludeTenantGuard()
  @ExcludeAuthGuard()
  async send2FACode(@Body() body: Send2FACodeDto) {
    return await this.multiFactorAuthService.send2FACode(
      body.email,
      body.pass,
      body.recaptchaToken,
      body.loginTenantId,
    );
  }

  @Post('verify')
  @ExcludeTenantGuard()
  @ExcludeAuthGuard()
  async verify2FACode(@Body() body: Verify2FACodeDto) {
    return await this.multiFactorAuthService.verify2FACode(body.uid, body.code);
  }
}
