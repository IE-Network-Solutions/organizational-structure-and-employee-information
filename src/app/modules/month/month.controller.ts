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
import { MonthService } from './month.service';
import { CreateMonthDto } from './dto/create-month.dto';
import { UpdateMonthDto } from './dto/update-month.dto';
import { ApiTags } from '@nestjs/swagger';
import { Month } from './entities/month.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { ExcludeAuthGuard } from '@root/src/core/guards/exclud.guard';

@Controller('month')
@ApiTags('month')
export class MonthController {
  constructor(private readonly monthService: MonthService) {}

  @Post()
  async createMonth(
    @Body() createMonthDto: CreateMonthDto,
    @Headers('tenantId') tenantId: string,
  ): Promise<Month> {
    return await this.monthService.createMonth(createMonthDto, tenantId);
  }
  @Get('')
  async findAllMonths(
    @Headers('tenantId') tenantId: string,
    @Query() paginationOptions?: PaginationDto,
  ) {
    return this.monthService.findAllMonths(tenantId, paginationOptions);
  }

  @Get(':id')
  findOneMonth(@Param('id') id: string) {
    return this.monthService.findOneMonth(id);
  }
  

  @Put(':id')
  updateMonth(
    @Headers('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() updateMonthDto: UpdateMonthDto,
  ) {
    return this.monthService.updateMonth(id, updateMonthDto, tenantId);
  }

  @Delete(':id')
  removeMonth(@Headers('tenantId') tenantId: string, @Param('id') id: string) {
    return this.monthService.removeMonth(id);
  }

  @Get('/active/month')
  @ExcludeAuthGuard()
  geActiveMonth(@Headers('tenantId') tenantId: string) {
    return this.monthService.geActiveMonth(tenantId);
  }

  @Get('/previousMonth/month')
  @ExcludeAuthGuard()
  activatePreviousActiveMonth(@Headers('tenantId') tenantId: string) {
    return this.monthService.activatePreviousActiveMonth(tenantId);
  }
}
