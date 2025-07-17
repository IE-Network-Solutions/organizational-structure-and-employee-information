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
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';

describe('MonthService', () => {
  let monthService: MonthService;
  let monthRepository: jest.Mocked<Repository<Month>>;
  let paginationService: PaginationService;

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
    paginationService = module.get<PaginationService>(PaginationService);
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
    it('should return paginated Month', async () => {
      const paginationOptions: PaginationDto = {
        page: 1,
        limit: 10,
        orderBy: 'id',
        orderDirection: 'ASC',
      };
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      const paginatedResult: Pagination<Month> = PaginationResultMonthData();
      const queryBuilderMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
        getOne: jest.fn(),
      };
      monthRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilderMock);
      const options = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };

      paginationService.paginate = jest.fn().mockResolvedValue(paginatedResult);

      const result = await monthService.findAllMonths(
        tenantId,
        paginationOptions,
      );

      expect(result).toEqual(paginatedResult);
      expect(paginationService.paginate).toHaveBeenCalledWith(
        queryBuilderMock,
        options,
      );
    });
  });

  describe('findOneMonth', () => {
    it('should return the month when found', async () => {
      monthRepository.findOne.mockResolvedValue(monthDataSave() as Month);

      const result = await monthService.findOneMonth('month-id');

      expect(monthRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'month-id' },
        relations: ['session', 'session.calendar'],
      });
      expect(result).toEqual(monthDataSave());
    });

    it('should throw NotFoundException if branch request not found', async () => {
      monthRepository.findOne.mockRejectedValue(
        new NotFoundException('Branch request not found'),
      );

      await expect(monthService.findOneMonth('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(monthRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'invalid-id' },
        relations: ['session', 'session.calendar'],
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

    it('should throw NotFoundException if branch request not found during removal', async () => {
      const nonExistingId = 'non-existing-id';

      jest
        .spyOn(monthService, 'findOneMonth')
        .mockRejectedValue(new NotFoundException(`Month Not Found`));

      await expect(monthService.removeMonth(nonExistingId)).rejects.toThrow(
        NotFoundException,
      );

      expect(monthRepository.softRemove).not.toHaveBeenCalled();
    });
  });
});
