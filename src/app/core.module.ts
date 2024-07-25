import { Global, Module } from '@nestjs/common';
import { PermissionModule } from './modules/permission/permission.module';

@Global()
@Module({
  imports: [
    PermissionModule,
  ],
})
export class CoreModule { }
