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
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import { Permission } from './entities/permission.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult } from 'typeorm';

@Controller('permissions')
@ApiTags('Permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  findAll(
    @Query() paginationOptions?: PaginationDto,
    @Query() searchFilterDTO?: SearchFilterDTO,
  ): Promise<Pagination<Permission>> {
    return this.permissionService.findAll(paginationOptions, searchFilterDTO);
  }

  @Get(':permissionId')
  findOne(@Param('permissionId') id: string): Promise<Permission> {
    return this.permissionService.findOne(id);
  }

  @Patch(':permissionId')
  update(
    @Param('permissionId') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':permissionId')
  remove(@Param('permissionId') id: string): Promise<UpdateResult> {
    return this.permissionService.remove(id);
  }
}
