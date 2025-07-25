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
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import { ExcludeAuthGuard } from '@root/src/core/guards/exclud.guard';

@Controller('roles')
@ApiTags('Roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ExcludeAuthGuard()
  create(@Req() request: Request, @Body() createRoleDto: CreateRoleDto) {
    const tenantId = request['tenantId'];
    return this.roleService.create(tenantId, createRoleDto);
  }

  @Get()
  findAll(
    @Req() request: Request,
    @Query() paginationOptions?: PaginationDto,
    @Query() searchFilterDTO?: SearchFilterDTO,
  ) {
    return this.roleService.findAll(
      paginationOptions,
      searchFilterDTO,
      request['tenantId'],
    );
  }

  @Get(':roleId')
  findOne(@Param('roleId') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':roleId')
  update(
    @Req() request: Request,
    @Param('roleId') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const tenantId = request['tenantId'];
    return this.roleService.update(id, updateRoleDto, tenantId);
  }

  @Delete(':roleId')
  @ExcludeAuthGuard()
  remove(@Param('roleId') id: string) {
    return this.roleService.remove(id);
  }

  @Get('/find-all-role-with-permissions/role-permissions')
  findAllRoleWithPermissions(
    @Req() request: Request,
    @Query() paginationOptions?: PaginationDto,
  ) {
    const tenantId = request['tenantId'];
    return this.roleService.findAllRoleWithPermissions(
      tenantId,
      paginationOptions,
    );
  }

  @Get('/find-one-role-with-permissions/role-permissions/:roleId')
  findOneRoleWithPermissions(@Param('roleId') id: string) {
    return this.roleService.findOneRoleWithPermissions(id);
  }

  @Delete('/:roleId/deAttach-permission/:permissionId')
  async deAttachPermissionsFromRole(
    @Param('roleId') roleId: string,
    @Body() permissionIds: string[],
  ) {
    return await this.roleService.deAttachPermissionsFromRole(
      roleId,
      permissionIds,
    );
  }
  @Get('/slug/:slug')
  @ExcludeAuthGuard()
  findRoleBySlug(@Req() request: Request, @Param('slug') slug: string) {
    const tenantId = request['tenantId'];
    return this.roleService.findRoleBySlug(slug, tenantId);
  }
}
