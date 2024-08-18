import { SetMetadata } from '@nestjs/common';

export const ExcludeTenantGuard = () => SetMetadata('isExcluded', true);
