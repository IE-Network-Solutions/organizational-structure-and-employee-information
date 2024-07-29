// import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { checkIfDataExists } from '@root/src/core/utils/checkIfDataExists.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly paginationService: PaginationService, // private readonly userPermissionService: UserPermissionService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    const valuesToCheck = { email: user.email };
    try {
      await checkIfDataExists(valuesToCheck, this.userRepository);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async findAll(paginationOptions: PaginationDto): Promise<Pagination<User>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder = await this.userRepository
        .createQueryBuilder('user')
        .orderBy('user.createdAt', 'DESC');

      return await this.paginationService.paginate<User>(queryBuilder, options);
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User not found.`);
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .getOne();

      return { ...user };
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.userRepository.findOneOrFail({ where: { id: id } });
      await this.userRepository.update({ id }, updateUserDto);
      return await this.userRepository.findOneOrFail({ where: { id: id } });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.userRepository.findOneOrFail({ where: { id: id } });
      return await this.userRepository.softDelete({ id });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw error;
    }
  }

  // async assignPermissionToUser(
  //   createUserPermissionDto: CreateUserPermissionDto,
  // ) {
  //   return await this.userPermissionService.assignPermissionToUser(
  //     createUserPermissionDto,
  //   );
  // }
  // async findPermissionsByUserId(id: string) {
  //   try {
  //     const user = await this.userRepository
  //       .createQueryBuilder('user')
  //       .leftJoinAndSelect('user.userPermissions', 'userPermission')
  //       .leftJoinAndSelect('userPermission.permission', 'permission')
  //       .where('user.id = :id', { id })
  //       .getOne();

  //     if (user) {
  //       const permissions = user.userPermissions
  //         .filter((userPermission) => userPermission.permission)
  //         .map((userPermission) => userPermission.permission);

  //       delete user.userPermissions;

  //       return {
  //         ...user,
  //         permissions: permissions,
  //       };
  //     } else {
  //       return null;
  //     }
  //   } catch (error) {
  //     if (error.name === 'EntityNotFoundError') {
  //       throw new NotFoundException(`User with id ${id} not found.`);
  //     }
  //     throw error;
  //   }
  // }

  // async deAttachOneUserPermissionByUserId(
  //   userId: string,
  //   permissionId: string,
  // ) {
  //   return await this.userPermissionService.deAttachOneUserPermissionByUserId(
  //     userId,
  //     permissionId,
  //   );
  // }
}
