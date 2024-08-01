import { FileUploadService } from '../../../core/commonServices/upload.service';
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
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from '@root/src/core/utils/upload-file.utils';
import { CreateEmployeeInformationDto } from '../employee-information/dto/create-employee-information.dto';
import { CreateEmployeeJobInformationDto } from '../employee-job-information/dto/create-employee-job-information.dto';
import { CreateEmployeeInformationFormDto } from '../employee-information-form/dto/create-employee-information-form.dto';
import { CreateNationalityDto } from '../nationality/dto/create-nationality.dto';
import { CreatePermissionDto } from '../permission/dto/create-permission.dto';
import { CreatePermissionGroupDto } from '../permission-group/dto/create-permission-group.dto';
import { CreateRoleDto } from '../role/dto/create-role.dto';
import { CreateEmployementTypeDto } from '../employment-type/dto/create-employement-type.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly userService: UserService,
    private readonly fileUploadService: FileUploadService,
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('profileImage', imageUploadOptions))
  async create(
    @Body() createUserDto: CreateUserDto,
    @Body() createEmployeeInformationDto: CreateEmployeeInformationDto,
    @Body() createEmployeeJobInformationDto: CreateEmployeeJobInformationDto,
    @Body() createEmployeeInformationFormDto: CreateEmployeeInformationFormDto,
    @Body() createNationalityDto: CreateNationalityDto,
    @Body() createEmployementTypeDto: CreateEmployementTypeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploadedFilePath = await this.fileUploadService.uploadFileToServer(createUserDto.tenantId, file);
    createUserDto.profileImage = uploadedFilePath['viewImage']
    createUserDto.profileImageDownload = uploadedFilePath['image']
    return this.userService.create(
      createUserDto,
      createEmployeeInformationDto,
      createEmployeeJobInformationDto,
      createEmployeeInformationFormDto,
      createNationalityDto,
      createEmployementTypeDto
    );
  }

  @Get()
  async findAll(
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<User>> {
    return await this.userService.findAll(paginationOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  // @Post('/assign-permission-to-user')
  // assignPermissionToRole(
  //   @Body() createUserPermissionDto: CreateUserPermissionDto,
  // ) {
  //   return this.usersService.assignPermissionToUser(createUserPermissionDto);
  // }

  // @Get('/permissions/:userId')
  // findPermissionsByUserId(@Param('userId') id: string) {
  //   return this.usersService.findPermissionsByUserId(id);
  // }

  // @Delete('/:userId/deAttach-permission/:permissionId')
  // async deAttachOneUserPermissionByUserId(
  //   @Param('userId') userId: string,
  //   @Param('permissionId') permissionId: string,
  // ) {
  //   return this.usersService.deAttachOneUserPermissionByUserId(
  //     userId,
  //     permissionId,
  //   );
  // }
}
