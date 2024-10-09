// import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { EmployementTypeService } from './employement-type.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { CreateEmployementTypeDto } from './dto/create-employement-type.dto';
import { UpdateEmployementTypeDto } from './dto/update-employement-type.dto';
import { EmployementType } from './entities/employement-type.entity';
import { ExcludeAuthGuard } from '@root/src/core/guards/exclud.guard';

@Controller('employement-type')
@ApiTags('Employement Type')
export class EmployementTypesController {
  constructor(
    private readonly employementTypeService: EmployementTypeService,
  ) {}

  @Post()
  @ExcludeAuthGuard()
  create(
    @Body() createEmployementTypeDto: CreateEmployementTypeDto,
    @Req() request: Request,
  ) {
    const tenantId = request['tenantId'];
    return this.employementTypeService.create(
      createEmployementTypeDto,
      tenantId,
    );
  }

  @Get()
  async findAll(
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<EmployementType>> {
    return await this.employementTypeService.findAll(paginationOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employementTypeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployementTypeDto: UpdateEmployementTypeDto,
  ) {
    return this.employementTypeService.update(id, updateEmployementTypeDto);
  }

  @Delete(':id')
  @ExcludeAuthGuard()
  remove(@Param('id') id: string) {
    return this.employementTypeService.remove(id);
  }
}
