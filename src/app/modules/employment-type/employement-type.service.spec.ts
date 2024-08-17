import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { EmployementTypeService } from './employement-type.service';
import { EmployementType } from './entities/employement-type.entity';
import {
  employementTypeData,
  createEmployementTypeData,
  paginationResultEmploymentTypeData,
  deleteEmploymentTypeData,
} from './tests/employement-type.data';

describe('EmployementTypeService', () => {
  let employementTypeService: EmployementTypeService;
  let employementTypeRepository: MockProxy<Repository<EmployementType>>;
  let paginationService: MockProxy<PaginationService>;
  const employementTypeToken = getRepositoryToken(EmployementType);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        EmployementTypeService,
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },
        {
          provide: employementTypeToken,
          useValue: mock<Repository<EmployementType>>(),
        },
      ],
    }).compile();

    employementTypeService = moduleRef.get<EmployementTypeService>(
      EmployementTypeService,
    );
    employementTypeRepository = moduleRef.get(employementTypeToken);
    paginationService = moduleRef.get(PaginationService);
  });

  describe('create', () => {
    describe('when create is called', () => {
      let request: { tenantId: string };

      beforeEach(() => {
        employementTypeRepository.create.mockReturnValue(employementTypeData());
        employementTypeRepository.save.mockResolvedValue(employementTypeData());
        request = { tenantId: '9fdb9540-607e-4cc5-aebf-0879400d1f69' };
      });

      it('should call employementTypeRepository.create with correct parameters', async () => {
        await employementTypeService.create(
          createEmployementTypeData(),
          request.tenantId,
        );
        expect(employementTypeRepository.create).toHaveBeenCalledWith({
          ...createEmployementTypeData(),
          tenantId: request.tenantId,
        });
      });

      it('should call employementTypeRepository.save with created employementType', async () => {
        await employementTypeService.create(
          createEmployementTypeData(),
          request.tenantId,
        );
        expect(employementTypeRepository.save).toHaveBeenCalledWith(
          employementTypeData(),
        );
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let employementType: EmployementType;
      let mockQueryBuilder: any;

      beforeEach(async () => {
        mockQueryBuilder = {
          where: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(employementTypeData()),
        };

        employementTypeRepository.createQueryBuilder.mockReturnValue(
          mockQueryBuilder,
        );

        employementType = await employementTypeService.findOne(
          employementTypeData().id,
        );
      });

      it('should call employementTypeRepository.createQueryBuilder and chain methods correctly', async () => {
        expect(
          employementTypeRepository.createQueryBuilder,
        ).toHaveBeenCalledWith('EmployeeType');
        expect(mockQueryBuilder.where).toHaveBeenCalledWith(
          'EmployeeType.id = :id',
          { id: employementTypeData().id },
        );
        expect(mockQueryBuilder.getOne).toHaveBeenCalled();
      });

      it('should return the employementType', () => {
        expect(employementType).toEqual(employementTypeData());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let mockQueryBuilder: any;
      let result: any;

      beforeEach(async () => {
        mockQueryBuilder = {
          orderBy: jest.fn().mockReturnThis(),
        };

        employementTypeRepository.createQueryBuilder.mockReturnValue(
          mockQueryBuilder,
        );
        paginationService.paginate.mockResolvedValue(
          paginationResultEmploymentTypeData(),
        );

        result = await employementTypeService.findAll(paginationOptions());
      });

      it('should call employementTypeRepository.createQueryBuilder and chain methods correctly', async () => {
        expect(
          employementTypeRepository.createQueryBuilder,
        ).toHaveBeenCalledWith('EmploymentType');
        expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
          'EmploymentType.createdAt',
          'DESC',
        );
      });

      it('should call paginationService.paginate with correct parameters', async () => {
        expect(paginationService.paginate).toHaveBeenCalledWith(
          mockQueryBuilder,
          {
            page: paginationOptions().page,
            limit: paginationOptions().limit,
          },
        );
      });

      it('should return paginated employementType', async () => {
        expect(result).toEqual(paginationResultEmploymentTypeData());
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let employementType: EmployementType;

      beforeEach(async () => {
        employementTypeRepository.findOneOrFail.mockResolvedValue(
          employementTypeData(),
        );

        employementType = await employementTypeService.update(
          employementTypeData().id,
          createEmployementTypeData(),
        );
      });

      it('should call employementTypeRepository.findOneOrFail initially', async () => {
        expect(employementTypeRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: employementTypeData().id },
        });
      });

      it('should call employementTypeRepository.update with correct parameters', async () => {
        await employementTypeService.update(
          employementTypeData().id,
          createEmployementTypeData(),
        );

        expect(employementTypeRepository.update).toHaveBeenCalledWith(
          { id: employementTypeData().id },
          createEmployementTypeData(),
        );
      });

      it('should return the updated employementType', async () => {
        const result = await employementTypeService.update(
          employementTypeData().id,
          createEmployementTypeData(),
        );

        expect(result).toEqual(employementTypeData());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        employementTypeRepository.findOneOrFail.mockResolvedValue(
          employementTypeData(),
        );
        employementTypeRepository.softDelete.mockResolvedValue(
          deleteEmploymentTypeData(),
        );
      });

      it('should call employementTypeRepository.findOneOrFail and softDelete', async () => {
        await employementTypeService.remove(employementTypeData().id);
        expect(employementTypeRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: employementTypeData().id },
        });
        expect(employementTypeRepository.softDelete).toHaveBeenCalledWith({
          id: employementTypeData().id,
        });
      });

      it('should return the delete result', async () => {
        const result = await employementTypeService.remove(
          employementTypeData().id,
        );
        expect(result).toEqual(deleteEmploymentTypeData());
      });
    });
  });
});
