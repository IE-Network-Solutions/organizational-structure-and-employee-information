import { Test, TestingModule } from '@nestjs/testing';
import { MonthService } from './month.service';
import { Repository } from 'typeorm';
import { Month } from './entities/month.entity';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  monthData,
  monthDataSave,
  PaginationResultMonthData,
} from './tests/month.data';
import { mock } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';

describe('MonthService', () => {
  let monthService: MonthService;
  let monthRepository: jest.Mocked<Repository<Month>>;
  let paginationService: jest.Mocked<PaginationService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonthService,
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },
        {
          provide: getRepositoryToken(Month),
          useValue: mock<Repository<Month>>(),
        },
      ],
    }).compile();

    monthService = module.get<MonthService>(MonthService);
    monthRepository = module.get(getRepositoryToken(Month));
    //paginationService = module.get<PaginationService>(PaginationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMonth', () => {
    it('should create and return a new month', async () => {
      monthRepository.create.mockReturnValue(monthDataSave() as Month);
      monthRepository.save.mockResolvedValue(monthDataSave() as Month);

      const result = await monthService.createMonth(
        monthDataSave() as any,
        'tenant-id',
      );

      expect(monthRepository.create).toHaveBeenCalledWith({
        ...monthDataSave(),
        tenantId: 'tenant-id',
      });
      expect(monthRepository.save).toHaveBeenCalledWith(monthDataSave());
      expect(result).toEqual(monthDataSave());
    });
  });

  describe('findAllMonths', () => {
    it('should return paginated data', async () => {
      // Define mock data for the test
      const tenantId = 'tenant-id';
      const options = { page: 1, limit: 10 };

      // Mock query builder
      const queryBuilderMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
      };

      // Mock repository's createQueryBuilder method
      // jest
      //   .spyOn(monthRepository, 'createQueryBuilder')
      //   .mockReturnValue(queryBuilderMock);

      // Mock the paginate function of PaginationService
      paginationService.paginate = jest
        .fn()
        .mockResolvedValue(PaginationResultMonthData());

      // Call the service method
      const result = await monthService.findAllMonths(tenantId, options);

      // Assertions
      expect(queryBuilderMock.where).toHaveBeenCalledWith(
        'Month.tenantId = :tenantId',
        { tenantId },
      );
      expect(paginationService.paginate).toHaveBeenCalledWith(
        queryBuilderMock,
        {
          page: options.page,
          limit: options.limit,
        },
      );
      expect(result).toEqual(PaginationResultMonthData());
    });
  });

  describe('findOneMonth', () => {
    it('should return the month when found', async () => {
      monthRepository.findOne.mockResolvedValue(monthDataSave() as Month);

      const result = await monthService.findOneMonth('month-id');

      expect(monthRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'month-id' },
      });
      expect(result).toEqual(monthDataSave());
    });

    it('should throw a NotFoundException when the month is not found', async () => {
      monthRepository.findOne.mockResolvedValue(null);

      await expect(monthService.findOneMonth('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(monthRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'invalid-id' },
      });
    });
  });

  describe('updateMonth', () => {
    it('should update and return the updated month', async () => {
      monthRepository.findOne.mockResolvedValue(monthDataSave() as Month);
      monthRepository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await monthService.updateMonth(
        'month-id',
        monthDataSave() as any,
        'tenant-id',
      );

      expect(monthRepository.update).toHaveBeenCalledWith(
        { id: 'month-id' },
        monthDataSave(),
      );
      expect(result).toEqual(monthDataSave());
    });

    it('should throw NotFoundException when the month is not found', async () => {
      monthRepository.findOne.mockResolvedValue(null);

      await expect(
        monthService.updateMonth('invalid-id', monthDataSave(), 'tenant-id'),
      ).rejects.toThrow('Month Not Found');
    });
  });

  describe('removeMonth', () => {
    it('should soft remove the month', async () => {
      monthRepository.findOne.mockResolvedValue(monthDataSave() as Month);

      const result = await monthService.removeMonth('month-id');

      expect(monthRepository.softRemove).toHaveBeenCalledWith({
        id: 'month-id',
      });
      expect(result).toEqual(monthDataSave());
    });

    it('should throw NotFoundException when the month is not found', async () => {
      monthRepository.findOne.mockResolvedValue(null);

      await expect(monthService.removeMonth('invalid-id')).rejects.toThrow(
        'Month Not Found',
      );
    });
  });
});
