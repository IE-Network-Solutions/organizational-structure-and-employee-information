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
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import { ExcludeAuthGuard } from '@root/src/core/guards/exclud.guard';
import { RolePermissionService } from './role-permission.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';

@Controller('roles-permissions')
@ApiTags('RolePermission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post()
  @ExcludeAuthGuard()
  createRoleWithPermissions(@Req() request: Request, @Body() createRolePermissionDto: CreateRolePermissionDto) {
    console.log(createRolePermissionDto,"createRolePermission")
    const tenantId = request['tenantId'];
    return this.rolePermissionService.createRoleWithPermissions(createRolePermissionDto.roleId,createRolePermissionDto.permissionId,tenantId);
  }
  @Delete('/:id')
  @ExcludeAuthGuard()
  removeRoleWithPermissions(@Req() request: Request, @Param('id') id: string ) {
    const tenantId = request['tenantId'];
    return this.rolePermissionService.remove(id);
  }
}
