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
} from '@nestjs/common';
import { NationalityService } from './nationality.service';
import { CreateNationalityDto } from './dto/create-nationality.dto';
import { UpdateNationalityDto } from './dto/update-nationality.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Nationality } from './entities/nationality.entity';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';

@Controller('nationality')
@ApiTags('Nationality')
export class NationalitysController {
  constructor(private readonly nationalityService: NationalityService) {}

  @Post()
  create(@Body() createNationalityDto: CreateNationalityDto, tenantId: string) {
    return this.nationalityService.create(createNationalityDto, tenantId);
  }

  @Get()
  async findAll(
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<Nationality>> {
    return await this.nationalityService.findAll(paginationOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nationalityService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNationalityDto: UpdateNationalityDto,
  ) {
    return this.nationalityService.update(id, updateNationalityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nationalityService.remove(id);
  }
}
