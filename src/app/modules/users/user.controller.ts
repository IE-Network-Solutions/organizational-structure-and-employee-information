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
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from './entities/user.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from '@root/src/core/utils/upload-file.utils';
import { CreateBulkRequestDto } from '@root/src/core/commonDto/createBulkRequest.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly userService: UserService,
    private readonly fileUploadService: FileUploadService,
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('profileImage', imageUploadOptions))
  async create(
    @Req() request: Request,
    @Body() createBulkRequestDto: CreateBulkRequestDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const tenantId = 'tenantId';

    // Example file upload logic
    // const uploadedFilePath = await this.fileUploadService.uploadFileToServer(tenantId, file);
    // createUserRequestDto.createUserDto.profileImage = uploadedFilePath['viewImage'];
    // createUserRequestDto.createUserDto.profileImageDownload = uploadedFilePath['image'];

    return this.userService.create(tenantId, createBulkRequestDto);
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
