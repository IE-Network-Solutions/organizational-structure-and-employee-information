import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { DelegationService } from './delegations.service';
import { Delegation } from './entities/delegation.entity';
import {
  createDelegationData,
  delegationData,
  deleteDelegationData,
  paginationResultDelegationData,
  updateDelegationData,
  updateDelegationDataReturned,
} from './tests/delegation.data';
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
    repository = module.get<Repository<Delegation>>(
      getRepositoryToken(Delegation),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
