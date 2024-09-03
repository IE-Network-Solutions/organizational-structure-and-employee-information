import { PaginationDto } from './../../../core/commonDto/pagination-dto';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { SearchFilterDTO } from './../../../core/commonDto/search-filter-dto';
import { UserPermission } from './entities/user-permission.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult } from 'typeorm';

export interface UserPermissionInterface {
    assignPermissionToUser(createUserPermissionDto: CreateUserPermissionDto,tenantId: string):Promise<any>;
    findAll(paginationOptions?: PaginationDto,searchFilterDTO?: SearchFilterDTO): Promise<Pagination<UserPermission>>;
    findOne(id: string): Promise<UserPermission> 
    update(id: string,userPermissionDto: CreateUserPermissionDto,tenantId: string):Promise<any>
    remove(id: string): Promise<UpdateResult>;
    deAttachOneUserPermissionByUserId(userId: string,permissionId: string):Promise<any>
}
