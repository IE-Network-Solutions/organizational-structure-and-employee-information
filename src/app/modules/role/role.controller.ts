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
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';

@Controller('roles')
@ApiTags('Roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll(
    @Query() paginationOptions?: PaginationDto,
    @Query() searchFilterDTO?: SearchFilterDTO,
  ) {
    return this.roleService.findAll(paginationOptions, searchFilterDTO);
  }

  @Get(':roleId')
  findOne(@Param('roleId') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':roleId')
  update(@Param('roleId') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':roleId')
  remove(@Param('roleId') id: string) {
    return this.roleService.remove(id);
  }

  // @Get('/find-all-role-with-permissions/role-permissions')
  // findAllRoleWithPermissions(@Query() paginationOptions?: PaginationDto) {
  //   return this.roleService.findAllRoleWithPermissions(paginationOptions);
  // }

  // @Get('/find-one-role-with-permissions/role-permissions/:roleId')
  // findOneRoleWithPermissions(@Param('roleId') id: string) {
  //   return this.roleService.findOneRoleWithPermissions(id);
  // }

  // @Delete('/:roleId/deAttach-permission/:permissionId')
  // async deAttachPermissionsFromRole(
  //   @Param('roleId') roleId: string,
  //   @Body() permissionIds: string[],
  // ) {
  //   return await this.roleService.deAttachPermissionsFromRole(
  //     roleId,
  //     permissionIds,
  //   );
  // }
}
