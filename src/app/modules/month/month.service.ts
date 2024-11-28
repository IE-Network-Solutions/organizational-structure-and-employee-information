import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMonthDto } from './dto/create-month.dto';
import { UpdateMonthDto } from './dto/update-month.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Month } from './entities/month.entity';
import { QueryRunner, Repository } from 'typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';

@Injectable()
export class MonthService {
  constructor( 
    @InjectRepository(Month)
    private monthRepository: Repository<Month>,
    private readonly paginationService: PaginationService)
    {}
    async  createMonth(
      createMonthDto: CreateMonthDto,
      tenantId: string,
      queryRunner?: QueryRunner,
    ): Promise<Month> {
      try {
        console.log(createMonthDto,"createMonthDto")
        const createdMonth = queryRunner
        ? queryRunner.manager.create(Month, {
            ...createMonthDto,
            tenantId,
          })
        : this.monthRepository.create({
            ...createMonthDto,
            tenantId,
          });
      return queryRunner
        ? await queryRunner.manager.save(Month, createdMonth)
        : await this.monthRepository.save(createdMonth);
      } catch (error) {
        console.log(error.message,"kkkk")
        throw new BadRequestException(error.message);
      }
    }
    
  async findAllMonths(
    tenantId: string,
    paginationOptions?: PaginationDto,
  ): Promise<Pagination<Month>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder = this.monthRepository
        .createQueryBuilder('Month')
        .where('Month.tenantId = :tenantId', { tenantId })
    
      const paginatedData = await this.paginationService.paginate<Month>(
        queryBuilder,
        options,
      );

      return paginatedData
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneMonth(id: string): Promise<Month> {
    try {
      const month = await this.monthRepository.findOne({
        where: { id: id },
      });
      return month;
    } catch (error) {
      throw new NotFoundException(`Month Not Found`);
    }
  }

  async updateMonth(
    id: string,
    updateMonthDto: UpdateMonthDto,
    tenantId: string,
  ): Promise<Month> {
    try{
    const month = await this.findOneMonth(id);
    if (!month) {
      throw new NotFoundException(`Month Not Found`);
    }
    await this.monthRepository.update({ id }, updateMonthDto);
    return await this.findOneMonth(id);
  }catch(error){
  throw new BadRequestException(error.message)
  }
  }

  async updateBulkMonth(
    updateMonthDto: UpdateMonthDto[],
    tenantId: string,
  ): Promise<Month[]> {
    try{
 const months= await Promise.all(updateMonthDto.map(async(item)=>
  await this.updateMonth(item.id,item,tenantId)
))
  return months

}catch(error){
  throw new BadRequestException(error.message)
  }
    
  }
  async removeMonth(id: string): Promise<Month> {
    try{
    const month = await this.findOneMonth(id);
    if (!Month) {
      throw new NotFoundException(`Month Not Found`);
    }
    await this.monthRepository.softRemove({ id });
    return month;
  }
  catch(error){
    throw new BadRequestException(error.message)
  }
  }

  async geActiveMonth(tenantId: string): Promise<Month> {
    try{
  
  return await this.monthRepository.findOneOrFail({where:{ tenantId:tenantId,active:true}});
    ;
  }
  catch(error){
    throw new BadRequestException(error.message)
  }
  }
}
