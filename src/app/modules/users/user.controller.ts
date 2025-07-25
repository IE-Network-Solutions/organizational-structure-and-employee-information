import { UserService } from './services/user.service';
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
  InternalServerErrorException,
  UploadedFile,
  Headers,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from './entities/user.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
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
import { FilterDto } from './dto/filter-status-user.dto';
import {
  ExcludeAuthGuard,
  ExcludeTenantGuard,
} from '@root/src/core/guards/exclud.guard';
import { Department } from '../departments/entities/department.entity';
import { UserDepartmentService } from './services/user-relation-with-department.service';
import { DissolveDepartmentDto } from '../departments/dto/dissolve-department.dto';
import { ImportEmployeeDto } from './dto/import-user.dto';
import { FilterEmailDto } from './dto/email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ExportUserDto } from './dto/export-user.dto';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userDepartmentService: UserDepartmentService,
  ) {}

  @Post('update-profile-image')
  @UseInterceptors(FileInterceptor('profileImage')) // Matches the field name of the file
  async updateProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { userId: string },
    @Req() request: Request,
  ) {
    const tenantId = request['tenantId'];
    const { userId } = body;
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    if (!file) {
      throw new BadRequestException('Profile image file is required');
    }

    try {
      return await this.userService.updateProfileImage(tenantId, userId, file);
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while updating the profile image. Please try again.',
      );
    }
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
    @Req() request: Request,
  ) {
    const profileImage = files?.find(
      (file) => file.fieldname === 'profileImage',
    );

    const documentName = files?.find(
      (file) => file.fieldname === 'documentName',
    );

    const {
      createUserDto,
      createRolePermissionDto,
      createUserPermissionDto,
      createEmployeeInformationDto,
      createEmployeeJobInformationDto,
      createEmployeeDocumentDto,
    } = body;

    const createUser = plainToInstance(
      CreateUserDto,
      createUserDto ? JSON.parse(createUserDto) : {},
    );

    const createRolePermission = plainToInstance(
      CreateRolePermissionDto,
      createRolePermissionDto ? JSON.parse(createRolePermissionDto) : {},
    );

    const createUserPermission = plainToInstance(
      CreateUserPermissionDto,
      createUserPermissionDto ? JSON.parse(createUserPermissionDto) : {},
    );

    const createEmployeeInfo = plainToInstance(
      CreateEmployeeInformationDto,
      createEmployeeInformationDto
        ? JSON.parse(createEmployeeInformationDto)
        : {},
    );

    const createEmployeeJob = plainToInstance(
      CreateEmployeeJobInformationDto,
      createEmployeeJobInformationDto
        ? JSON.parse(createEmployeeJobInformationDto)
        : {},
    );

    const createEmployeeDoc = plainToInstance(
      CreateEmployeeDocumentDto,
      createEmployeeDocumentDto ? JSON.parse(createEmployeeDocumentDto) : {},
    );

    for (const dto of [
      createUser,
      createRolePermission,
      createUserPermission,
      createEmployeeInfo,
      createEmployeeJob,
      createEmployeeDoc,
    ]) {
      const errors = await validate(dto);

      if (errors.length > 0) {
        throw new BadRequestException(
          `Validation failed: ${errors
            .map((err) => Object.values(err.constraints || {}).join(', '))
            .join(', ')}`,
        );
      }
    }

    const createBulkRequestDto = {
      createUserDto: parseNestedJson(createUserDto),
      createRolePermissionDto: parseNestedJson(createRolePermissionDto),
      createUserPermissionDto: parseNestedJson(createUserPermissionDto),
      createEmployeeInformationDto: parseNestedJson(
        createEmployeeInformationDto,
      ),
      createEmployeeJobInformationDto: parseNestedJson(
        createEmployeeJobInformationDto,
      ),
      createEmployeeDocumentDto: parseNestedJson(createEmployeeDocumentDto),
    };

    const tenantId = request['tenantId'];
    return await this.userService.create(
      tenantId,
      createBulkRequestDto,
      profileImage,
      documentName,
    );
  }

  @Get('/info/user-info')
  async findUserInfoByArrayOfUserIds(
    @Body() arrayOfId: string[],
  ): Promise<any> {
    return await this.userService.findUserInfoByArrayOfUserIds(arrayOfId);
  }

  @Get()
  async findAll(
    @Req() request: Request,
    @Query() filterDto?: FilterDto,
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<User>> {
    const tenantId = request['tenantId'];
    return await this.userService.findAll(
      filterDto,
      paginationOptions,
      tenantId,
    );
  }
  @Get('/all-users/all')
  async findAllWithOutFilter(
    @Req() request: Request,
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<User>> {
    const tenantId = request['tenantId'];
    return await this.userService.findAllWithOutFilter(
      paginationOptions,
      tenantId,
    );
  }

  @Get('/all-users/all/payroll-data')
  async findAllPayRollUsers(
    @Req() request: Request,
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<User>> {
    const tenantId = request['tenantId'];
    return await this.userService.findAllPayRollUsers(
      paginationOptions,
      tenantId,
    );
  }

  @Get(':id')
  @ExcludeAuthGuard()
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }
  @Get(':id/without-tenant')
  @ExcludeAuthGuard()
  @ExcludeTenantGuard()
  findOneWithoutTenant(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }
  @Patch(':id')
  @UseInterceptors(FileInterceptor('profileImage'))
  async update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() profileImage?: Express.Multer.File,
  ) {
    try {
      const tenantId = request['tenantId'];
      const updatedUser = await this.userService.update(
        id,
        tenantId,
        updateUserDto,
        profileImage,
      );
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while updating the user. Please try again.',
      );
    }
  }

  @Delete(':id')
  @ExcludeAuthGuard()
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

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
  async findUserByFirbaseId(
    @Param('firebaseId') firebaseId: string,
  ): Promise<User> {
    return await this.userService.findUserByFirbaseId(firebaseId);
  }

  @Post('/create-first-user-for-tenant')
  @ExcludeAuthGuard()
  async createFromTenant(@Body() body: any, @Req() request: Request) {
    const { createUserDto } = body;
    const role = createUserDto.role;
    delete createUserDto.role;
    const tenantId = request['tenantId'];
    return await this.userService.createFromTenant(
      createUserDto,
      tenantId,
      role,
    );
  }

  @Get('/all/departments')
  @ExcludeAuthGuard()
  findAllDepartments(@Req() request: Request): Promise<Department[]> {
    const tenantId = request['tenantId'];
    return this.userDepartmentService.findAllDepartments(tenantId);
  }
  @Get('/child/departments/:departmentId')
  @ExcludeAuthGuard()
  findAllChildDepartmentsWithUsers(
    @Req() request: Request,
    @Param('departmentId') departmentId: string,
  ): Promise<Department[]> {
    const tenantId = request['tenantId'];
    return this.userDepartmentService.findAllChildDepartmentsWithUsers(
      tenantId,
      departmentId,
    );
  }

  @Post('/department/dissolve')
  dissolveDepartment(
    @Req() request: Request,
    @Body() dissolveDepartmentDto: DissolveDepartmentDto,
  ): Promise<Department> {
    const tenantId = request['tenantId'];
    return this.userDepartmentService.dissolveDepartment(
      dissolveDepartmentDto,
      tenantId,
    );
  }
  @Post('/department/merge')
  mergeDepartment(
    @Req() request: Request,
    @Body() dissolveDepartmentDto: DissolveDepartmentDto,
  ): Promise<Department> {
    const tenantId = request['tenantId'];
    return this.userDepartmentService.mergeDepartment(
      dissolveDepartmentDto,
      tenantId,
    );
  }

  @Post('/resetPassword')
  @ExcludeAuthGuard()
  @ExcludeTenantGuard()
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<string> {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Post('/import/users')
  @ExcludeAuthGuard()
  importUser(
    @Req() request: Request,
    @Body() importEmployeeDto: ImportEmployeeDto[],
  ) {
    const tenantId = request['tenantId'];
    return this.userService.importUser(importEmployeeDto, tenantId);
  }

  @Post('/export')
  // @ExcludeAuthGuard()
  async exportUserData(
    @Req() request: Request,
    @Body() exportUserDto: ExportUserDto,
  ) {
    const tenantId = request['tenantId'];
    const { fileUrl } = await this.userService.exportUserData(
      tenantId,
      exportUserDto,
    );
    return { fileUrl };
  }

  @Get('/simple-info/:userId')
  getOneUser(
    @Param('userId') userId: string,
    @Headers('tenantId') tenantId: string,
  ) {
    return this.userService.getOneUSer(userId, tenantId);
  }

  @Get('/all/users-id')
  @ExcludeAuthGuard()
  @ExcludeTenantGuard()
  getAllUSerIds() {
    return this.userService.getAllUSerIds();
  }
  @Get('/simple-info/all-user/with-tenant')
  @ExcludeAuthGuard()
  getAllUser(@Req() request: Request) {
    const tenantId = request['tenantId'];
    return this.userService.getAllUser(tenantId);
  }

  @Get('/simple-info/all-user-net-pay/with-tenant')
  getAllUsersWithNetPay(@Req() request: Request) {
    const tenantId = request['tenantId'];
    return this.userService.getAllUsersWithNetPay(tenantId);
  }
  @Get('/all/departments-users/:userId')
  @ExcludeAuthGuard()
  findSingleUserDepartmentUsers(
    @Req() request: Request,
    @Param('userId') userId: string,
  ) {
    const tenantId = request['tenantId'];
    return this.userDepartmentService.findSingleUserDepartmentUsers(
      userId,
      tenantId,
    );
  }

  @Post('/email')
  @ExcludeAuthGuard()
  findUserByEmail(@Req() request: Request, @Body() email: FilterEmailDto) {
    const tenantId = request['tenantId'];
    return this.userService.findUserByEmail(email, tenantId);
  }

  @Post('/email/without-tenant')
  @ExcludeAuthGuard()
  @ExcludeTenantGuard()
  findUserByEmailWithOutTenantID(@Body() email: FilterEmailDto) {
    return this.userService.findUserByEmailWithOutTenantID(email);
  }

  @Get('get-all-users/joined-date')
  getAllUsersJoinedDate(@Req() request: Request) {
    const tenantId = request['tenantId'];
    return this.userService.getAllUsersJoinedDate(tenantId);
  }
}
