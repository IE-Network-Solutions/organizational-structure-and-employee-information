import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { Delegation } from "./entities/delegation.entity";
import { CreateDelegationDto } from "./dto/create-delegation.dto";
import { UpdateDelegationDto } from "./dto/update-delegation.dto";
import { PaginationDto } from "@root/src/core/commonDto/pagination-dto";
import { PaginationService } from "@root/src/core/pagination/pagination.service";
import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";

@Injectable()
export class DelegationService {
  constructor(
    @InjectRepository(Delegation)
    private readonly delegationRepository: Repository<Delegation>,
     private paginationService: PaginationService,
  ) {}

  async create(createDelegationDto: CreateDelegationDto,tenantId:string): Promise<Delegation> {
    try {
      const delegation = this.delegationRepository.create({...createDelegationDto,tenantId});
      return await this.delegationRepository.save(delegation);
      
    } catch (error) {
      throw new BadRequestException(error.message);
    }
   
  }

  async findAll(tenantId:string, paginationOptions: PaginationDto): Promise<Pagination<Delegation>> {
    try {
         const options: IPaginationOptions = {
            page: paginationOptions.page,
            limit: paginationOptions.limit,
          };
const orderBy = "CreatedAt";
const orderDirection = 'ASC';

  return await this.paginationService.paginate<Delegation>(
    this.delegationRepository,
    'd', 
    options,
    orderBy,
    orderDirection,
    { tenantId } 
  );
     
    } catch (error) {
      throw new BadRequestException(error.message);
      
    }
   
  }

  async findOne(id: string): Promise<Delegation> {
    try {
      const delegation = await this.delegationRepository.findOne({ where: { id } });
      if (!delegation) {
        throw new NotFoundException(`Delegation Not found`);
      }
      return delegation;
      
    } catch (error) {
      throw new BadRequestException(error.message);
      
    }
   
  }
  async findUserOnLeaveById(userId: string): Promise<Delegation> {
    try {
      const delegation = await this.delegationRepository.findOne({ 
        where: { 
          delegatorId: userId, 
          status: true, 
          startDate: LessThanOrEqual(new Date()), 
          endDate: MoreThanOrEqual(new Date()) 
        } 
      });      
      return delegation;
      
    } catch (error) {
      throw new BadRequestException(error.message);
      
    }
   
  }
  async findDelegationByLeaveRequestId(leaveRequestId: string,tenantId:string): Promise<Delegation> {
    try {
      const delegation = await this.delegationRepository.findOne({ 
        where: { 
          leaveRequestId: leaveRequestId, 
         tenantId:tenantId
        } 
      });      
      return delegation;
      
    } catch (error) {
      throw new BadRequestException(error.message);
      
    }
   
  }

  async update(id: string, updateDelegationDto: UpdateDelegationDto): Promise<Delegation> {
    try {
      await this.delegationRepository.update(id, updateDelegationDto);
      return this.findOne(id);
      
    } catch (error) {
      throw new BadRequestException(error.message);

    }
  
  }


  async updateDelegationByLeaveRequestId(leaveRequestId: string, updateDelegationDto: UpdateDelegationDto,tenantId:string): Promise<Delegation> {
    try {
      const delegation = await this.findDelegationByLeaveRequestId(leaveRequestId,tenantId);
      if(delegation){
        await this.delegationRepository.update(
          { leaveRequestId, tenantId },
          updateDelegationDto
        );      }
     
      return await this.findDelegationByLeaveRequestId(leaveRequestId,tenantId);

      
    } catch (error) {
      throw new BadRequestException(error.message);

    }
  
  }

  async remove(id: string): Promise<Delegation> {
    try {
      const delegation = await this.findOne(id);
      await this.delegationRepository.softRemove(delegation);
      return delegation;
    } catch (error) {
      throw new BadRequestException(error.message);

    }
  
  }
}
