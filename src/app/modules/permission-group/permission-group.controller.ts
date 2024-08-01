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
import { PermissionGroupService } from './permission-group.service';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import { PermissionGroup } from './entities/permission-group.entity';

@Controller('permission-group')
@ApiTags('Permission Group')
export class PermissionGroupController {
  constructor(
    private readonly permissionGroupService: PermissionGroupService,
  ) { }

  @Post()
  create(
    @Body() createPermissionGroupDto: CreatePermissionGroupDto,
  ): Promise<PermissionGroup> {
    return this.permissionGroupService.create(createPermissionGroupDto);
  }

  @Get()
  findAll(
    @Query() paginationOptions?: PaginationDto,
    @Query() searchFilterDTO?: SearchFilterDTO,
  ) {
    return this.permissionGroupService.findAll(
      paginationOptions,
      searchFilterDTO,
    );
  }

  @Get(':permissionGroupId')
  findOne(@Param('permissionGroupId') id: string) {
    return this.permissionGroupService.findOne(id);
  }

  @Patch(':permissionGroupId')
  update(
    @Param('permissionGroupId') id: string,
    @Body() updatePermissionGroupDto: UpdatePermissionGroupDto,
  ) {
    return this.permissionGroupService.update(id, updatePermissionGroupDto);
  }

  @Delete(':permissionGroupId')
  remove(@Param('permissionGroupId') id: string) {
    return this.permissionGroupService.remove(id);
  }
}
