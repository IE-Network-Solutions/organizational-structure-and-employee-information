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
import { CreateNationalityDto } from './dto/create-nationality.dto';
import { Nationality } from './entities/nationality.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { UpdateNationalityDto } from './dto/update-nationality.dto';

@Injectable()
export class NationalityService {
  constructor(
    @InjectRepository(Nationality)
    private nationalityRepository: Repository<Nationality>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createNationalityDto: CreateNationalityDto, tenantId: string) {
    const user = this.nationalityRepository.create({
      ...createNationalityDto,
      tenantId,
    });
    try {
      return await this.nationalityRepository.save(user);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async findAll(
    paginationOptions: PaginationDto,
  ): Promise<Pagination<Nationality>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder = await this.nationalityRepository
        .createQueryBuilder('nationality')
        .orderBy('nationality.createdAt', 'DESC');

      return await this.paginationService.paginate<Nationality>(
        queryBuilder,
        options,
      );
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`nationality not found.`);
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const nationality = await this.nationalityRepository
        .createQueryBuilder('nationality')
        .where('nationality.id = :id', { id })
        .getOne();

      return { ...nationality };
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`nationality with id ${id} not found.`);
      }
      throw error;
    }
  }

  async update(id: string, updateNationalityDto: UpdateNationalityDto) {
    try {
      await this.nationalityRepository.findOneOrFail({ where: { id: id } });
      await this.nationalityRepository.update({ id }, updateNationalityDto);
      return await this.nationalityRepository.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.nationalityRepository.findOneOrFail({ where: { id: id } });
      return await this.nationalityRepository.softDelete({ id });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw error;
    }
  }
}
