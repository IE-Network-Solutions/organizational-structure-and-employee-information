import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateDelegationDto } from './dto/create-delegation.dto';
import { DelegationService } from './delegations.service';
import { UpdateDelegationDto } from './dto/update-delegation.dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { ExcludeAuthGuard } from '@root/src/core/guards/exclud.guard';

@Controller('delegations')
@ApiTags('delegations')
export class DelegationController {
  constructor(private readonly delegationService: DelegationService) {}
  @ExcludeAuthGuard()
  @Post()
  create(
    @Body() createDelegationDto: CreateDelegationDto,
    @Headers('tenantId') tenantId: string,
  ) {
    return this.delegationService.create(createDelegationDto, tenantId);
  }

  @Get()
  findAll(
    @Headers('tenantId') tenantId: string,
    @Query()
    paginationOptions?: PaginationDto,
  ) {
    return this.delegationService.findAll(tenantId, paginationOptions);
  }
  @ExcludeAuthGuard()
  @Get('/leave-request/:leaveRequestId')
  findDelegationByLeaveRequestId(
    @Param('leaveRequestId') leaveRequestId: string,
    @Headers('tenantId') tenantId: string,
  ) {
    return this.delegationService.findDelegationByLeaveRequestId(
      leaveRequestId,
      tenantId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.delegationService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDelegationDto: UpdateDelegationDto,
  ) {
    return this.delegationService.update(id, updateDelegationDto);
  }

  @ExcludeAuthGuard()
  @Put('/leave-request/:leaveRequestId')
  updateDelegationByLeaveRequestId(
    @Param('leaveRequestId') leaveRequestId: string,
    @Body() updateDelegationDto: UpdateDelegationDto,
    @Headers('tenantId') tenantId: string,
  ) {
    return this.delegationService.updateDelegationByLeaveRequestId(
      leaveRequestId,
      updateDelegationDto,
      tenantId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.delegationService.remove(id);
  }
  @ExcludeAuthGuard()
  @Delete('/leave-request/:leaveRequestId')
  removeDelegationByRequestId(
    @Param('leaveRequestId') leaveRequestId: string,
    @Headers('tenantId') tenantId: string,
  ) {
    return this.delegationService.removeDelegationByRequestId(
      leaveRequestId,
      tenantId,
    );
  }
}
