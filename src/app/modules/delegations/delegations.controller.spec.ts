import { Test, TestingModule } from '@nestjs/testing';
import { DelegationService } from './delegations.service';
import { DelegationController } from './delegations.controller';
import { createDelegationData, delegationData, deleteDelegationData, findOneNotFoundReturnValue, paginationResultDelegationData, updateDelegationData } from './tests/delegation.data';
import { CreateDelegationDto } from './dto/create-delegation.dto';
import { UpdateDelegationDto } from './dto/update-delegation.dto';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { mock } from 'jest-mock-extended';

describe('DelegationController', () => {
  let controller: DelegationController;
  let service: DelegationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DelegationController],
      providers: [
        {
          provide: DelegationService,
          useValue: {
            create: jest.fn().mockResolvedValue(delegationData()),
            findAll: jest.fn().mockResolvedValue(paginationResultDelegationData()),
            findOne: jest.fn().mockResolvedValue(delegationData()),
            update: jest.fn().mockResolvedValue(updateDelegationData()),
            remove: jest.fn().mockResolvedValue(deleteDelegationData()),
          },
        },
         {
                  provide: PaginationService,
                  useValue: mock<PaginationService>(),
                },
      ],
    }).compile();

    controller = module.get<DelegationController>(DelegationController);
    service = module.get<DelegationService>(DelegationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});