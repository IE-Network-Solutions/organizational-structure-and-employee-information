import { tenantId } from './../branchs/tests/branch.data';
import { UserService } from './user.service';
import { SearchFilterDTO } from './../../../core/commonDto/search-filter-dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  Req,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from './entities/user.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserPermissionDto } from '../user-permission/dto/create-user-permission.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateRolePermissionDto } from '../role-permission/dto/create-role-permission.dto';
import { CreateEmployeeInformationDto } from '../employee-information/dto/create-employee-information.dto';
import { CreateEmployeeJobInformationDto } from '../employee-job-information/dto/create-employee-job-information.dto';
import { CreateEmployeeDocumentDto } from '../employee-documents/dto/create-employee-documents.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { parseNestedJson } from '@root/src/core/utils/parseNestedJson.utils';
import { FilterUsertDto } from './dto/filter-user.dto';
//import { FilterStatusDto } from './dto/filter-status-user.dto';
import { ExcludeTenantGuard } from '@root/src/core/guards/excludetenant.guard';
import { FilterDto } from './dto/filter-status-user.dto';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService,
  ) { }


  // @Post()
  // async usercre() {
  //   const data = {
  //     "firstName": "John",
  //     "middleName": " A.",
  //     "lastName": "Doe",
  //     "email": "john.doe22223@example.com",
  //     "roleId": " bc80dfd2-1e02-4f3c-ad42-b39648ff2ecf"
  //   }

  //   return await this.userService.createeee(data, "tenantId");
  // }


  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
    @Req() request: Request,
  ) {


    const profileImage = files.find(file => file.fieldname === 'profileImage');

    const documentName = files.find(file => file.fieldname === 'documentName');
    console.log(profileImage, documentName, "l")

    const { createUserDto, createRolePermissionDto, createUserPermissionDto, createEmployeeInformationDto, createEmployeeJobInformationDto, createEmployeeDocumentDto } = body;

    const createUser = plainToInstance(CreateUserDto, createUserDto ? JSON.parse(createUserDto) : {});

    const createRolePermission = plainToInstance(CreateRolePermissionDto, createRolePermissionDto ? JSON.parse(createRolePermissionDto) : {});

    const createUserPermission = plainToInstance(CreateUserPermissionDto, createUserPermissionDto ? JSON.parse(createUserPermissionDto) : {});

    const createEmployeeInfo = plainToInstance(CreateEmployeeInformationDto, createEmployeeInformationDto ? JSON.parse(createEmployeeInformationDto) : {});

    const createEmployeeJob = plainToInstance(CreateEmployeeJobInformationDto, createEmployeeJobInformationDto ? JSON.parse(createEmployeeJobInformationDto) : {});

    const createEmployeeDoc = plainToInstance(CreateEmployeeDocumentDto, createEmployeeDocumentDto ? JSON.parse(createEmployeeDocumentDto) : {});

    for (const dto of [createUser, createRolePermission, createUserPermission, createEmployeeInfo, createEmployeeJob, createEmployeeDoc]) {

      const errors = await validate(dto);

      if (errors.length > 0) {
        throw new BadRequestException(`Validation failed: ${errors.map(err => Object.values(err.constraints || {}).join(', ')).join(', ')}`);
      }
    }

    let createBulkRequestDto = {
      createUserDto: parseNestedJson(createUserDto),
      createRolePermissionDto: parseNestedJson(createRolePermissionDto),
      createUserPermissionDto: parseNestedJson(createUserPermissionDto),
      createEmployeeInformationDto: parseNestedJson(createEmployeeInformationDto),
      createEmployeeJobInformationDto: parseNestedJson(createEmployeeJobInformationDto),
      createEmployeeDocumentDto: parseNestedJson(createEmployeeDocumentDto),
    }

    const tenantId = request['tenantId'];

    return await this.userService.create(tenantId, createBulkRequestDto, profileImage, documentName);
  }

  @Get()
  async findAll(
    @Req() request: Request,
    @Query() filterDto?: FilterDto,
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<User>> {
    const tenantId = request['tenantId']
    return await this.userService.findAll(filterDto, paginationOptions, tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }


  // @Get('many')
  // findBulkUsers(@Body() user: any): Promise<User[]> {
  //   return this.userService.findOne(id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('/search/users')
  searchUsers(
    @Req() req: Request,
    @Body() filterUsertDto?: FilterUsertDto,
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<User>> {
    const tenantId = req['tenantId'];
    return this.userService.searchUsers(
      filterUsertDto,
      paginationOptions,
      tenantId,
    );
  }
  // @Post('/assign-permission-to-user')
  // assignPermissionToRole(
  //   @Body() createUserPermissionDto: CreateUserPermissionDto,
  // ) {
  //   return this.usersService.assignPermissionToUser(createUserPermissionDto);
  // }

  @Get('/permissions/:userId')
  findPermissionsByUserId(@Param('userId') id: string) {
    return this.userService.findPermissionsByUserId(id);
  }

  @Delete('/:userId/deAttach-permission/:permissionId')
  async deAttachOneUserPermissionByUserId(
    @Param('userId') userId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.userService.deAttachOneUserPermissionByUserId(
      userId,
      permissionId,
    );
  }

  @Get('/firebase/:firebaseId')
  @ExcludeTenantGuard()
  async findUserByFirbaseId(@Param('firebaseId') firebaseId: string): Promise<User> {
    return await this.userService.findUserByFirbaseId(firebaseId)
  }
}