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

  describe('create', () => {
    it('should create a delegation', async () => {
      const tenantId = 'd4f7b2a5-6e9b-4b30-913f-8123a2cceee4';
      const dto: CreateDelegationDto = createDelegationData();
      await expect(controller.create(dto, tenantId)).resolves.toEqual(delegationData());
      expect(service.create).toHaveBeenCalledWith(dto, tenantId);
    });
  });

  describe('findAll', () => {
    it('should return paginated delegation data', async () => {
      const tenantId ='d4f7b2a5-6e9b-4b30-913f-8123a2cceee4'
      await expect(controller.findAll(tenantId,{ page: 1, limit: 10 })).resolves.toEqual(paginationResultDelegationData());
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single delegation', async () => {
      await expect(controller.findOne('1')).resolves.toEqual(delegationData());
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw a 404 error if delegation not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(findOneNotFoundReturnValue());
      await expect(controller.findOne('4567')).rejects.toEqual(findOneNotFoundReturnValue());
    });
  });

  describe('update', () => {
    it('should update a delegation', async () => {
      const dto: UpdateDelegationDto = updateDelegationData();
      await expect(controller.update('1', dto)).resolves.toEqual(updateDelegationData());
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should delete a delegation', async () => {
      await expect(controller.remove('1')).resolves.toEqual(deleteDelegationData());
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});