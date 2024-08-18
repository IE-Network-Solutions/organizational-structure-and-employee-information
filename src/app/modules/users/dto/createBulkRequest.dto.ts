import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from '@root/src/app/modules/users/dto/create-user.dto';
import { CreateEmployeeInformationDto } from '@root/src/app/modules/employee-information/dto/create-employee-information.dto';
import { CreateEmployeeJobInformationDto } from '@root/src/app/modules/employee-job-information/dto/create-employee-job-information.dto';
import { CreateEmployeeDocumentDto } from '@root/src/app/modules/employee-documents/dto/create-employee-documents.dto';
import { CreateRolePermissionDto } from '@root/src/app/modules/role-permission/dto/create-role-permission.dto';
import { CreateUserPermissionDto } from '../../user-permission/dto/create-user-permission.dto';
import { CreateNationalityDto } from '../../nationality/dto/create-nationality.dto';
import { CreateEmployementTypeDto } from '../../employment-type/dto/create-employement-type.dto';

export class CreateBulkRequestDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  createUserDto: CreateUserDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateRolePermissionDto)
  createRolePermissionDto: CreateRolePermissionDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserPermissionDto)
  createUserPermissionDto: CreateUserPermissionDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateEmployeeInformationDto)
  createEmployeeInformationDto: CreateEmployeeInformationDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateEmployeeJobInformationDto)
  createEmployeeJobInformationDto: CreateEmployeeJobInformationDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateEmployeeDocumentDto)
  createEmployeeDocumentDto: CreateEmployeeDocumentDto;
}
