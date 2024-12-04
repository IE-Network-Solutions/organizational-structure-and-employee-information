import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Query,
  Put,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('session')
@ApiTags('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async createSession(
    @Body() createSessionDto: CreateSessionDto,
    @Headers('tenantId') tenantId: string,
  ): Promise<Session> {
    return await this.sessionService.createSession(createSessionDto, tenantId);
  }

  @Get('')
  async findAllSessions(
    @Headers('tenantId') tenantId: string,
    @Query() paginationOptions?: PaginationDto,
  ) {
    return this.sessionService.findAllSessions(tenantId, paginationOptions);
  }

  @Get(':id')
  findOneSession(@Param('id') id: string) {
    return this.sessionService.findOneSession(id);
  }

  @Put(':id')
  updateSession(
    @Headers('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.sessionService.updateSession(id, updateSessionDto, tenantId);
  }

  @Delete(':id')
  removeSession(
    @Headers('tenantId') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.sessionService.removeSession(id);
  }
  @Get('/active/session')
  getActiveSession(@Headers('tenantId') tenantId: string) {
    return this.sessionService.getActiveSession(tenantId);
  }
}
