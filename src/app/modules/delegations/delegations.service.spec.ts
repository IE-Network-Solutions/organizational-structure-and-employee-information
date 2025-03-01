import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { DelegationService } from './delegations.service';
import { Delegation } from './entities/delegation.entity';
import { createDelegationData, delegationData, deleteDelegationData, paginationResultDelegationData, updateDelegationData, updateDelegationDataReturned } from './tests/delegation.data';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { mock } from 'jest-mock-extended';


describe('DelegationService', () => {
  let service: DelegationService;
  let repository: Repository<Delegation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DelegationService,
        {
          provide: getRepositoryToken(Delegation),
          useClass: Repository,
        },
         {
                  provide: PaginationService,
                  useValue: mock<PaginationService>(),
                },

      ],
    }).compile();

    service = module.get<DelegationService>(DelegationService);
    repository = module.get<Repository<Delegation>>(getRepositoryToken(Delegation));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new delegation', async () => {
      const tenantId ='d4f7b2a5-6e9b-4b30-913f-8123a2cceee4'

      jest.spyOn(repository, 'save').mockResolvedValue(delegationData());
      const result = await service.create(createDelegationData(),tenantId);
      expect(result).toEqual(delegationData());
    });
  });

  describe('findAll', () => {
    it('should return paginated delegation list', async () => {
      const tenantId ='d4f7b2a5-6e9b-4b30-913f-8123a2cceee4'
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([[delegationData()], 1]);
      const result = await service.findAll(tenantId,{ page: 1, limit: 10 });
      expect(result).toEqual(paginationResultDelegationData());
    });
  });

  describe('findOne', () => {
    it('should return a delegation by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(delegationData());
      const result = await service.findOne('be21f28b-4651-4d6f-8f08-d8128da64ee5');
      expect(result).toEqual(delegationData());
    });

    it('should return not found error', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('4567')).rejects.toThrowError('Delegation with Id 4567 not found');
    });
  });

  describe('update', () => {
    it('should update delegation details', async () => {
      jest.spyOn(repository, 'update').mockResolvedValue(updateDelegationDataReturned());
      const result = await service.update('be21f28b-4651-4d6f-8f08-d8128da64ee5', updateDelegationData());
      expect(result).toEqual(updateDelegationDataReturned());
    });
  });

  describe('remove', () => {
    it('should delete delegation', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(deleteDelegationData());
      const result = await service.remove('be21f28b-4651-4d6f-8f08-d8128da64ee5');
      expect(result).toEqual(deleteDelegationData());
    });
  });
});
