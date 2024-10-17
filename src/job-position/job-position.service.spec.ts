import { Repository } from 'typeorm';
import { JobPositionService } from './job-position.service';
import { MockProxy } from 'jest-mock-extended';
import { PaginationService } from '../core/pagination/pagination.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import {
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  createJobPositionData,
  jobPositionData,
  paginationResultJobPositionData,
  updateJobPositionData,
} from './tests/jobposition.data';
import { paginationOptions } from '../core/commonTestData/commonTest.data';
import { JobPosition } from './entities/job-position.entity';

describe('JobPositionService', () => {
  let jobPositionService: JobPositionService;
  let jobPositionRepository: MockProxy<Repository<JobPosition>>;
  let paginationService: MockProxy<PaginationService>;
  const jobPositionToken = getRepositoryToken(JobPosition);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        JobPositionService,
        {
          provide: PaginationService,
          useValue: (paginationService = {
            paginate: jest.fn(),
          } as any),
        },
        {
          provide: jobPositionToken,
          useValue: (jobPositionRepository = {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          } as any),
        },
      ],
    }).compile();

    jobPositionService = moduleRef.get<JobPositionService>(JobPositionService);
  });

  describe('create', () => {
    it('should throw ConflictException if the job position already exists', async () => {
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      jobPositionRepository.findOne.mockResolvedValue(jobPositionData());

      await expect(
        jobPositionService.create(tenantId, createJobPositionData()),
      ).rejects.toThrow(ConflictException);
    });

    it('should create and return a new job position', async () => {
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      jobPositionRepository.findOne.mockResolvedValue(undefined); // No conflict
      jobPositionRepository.create.mockReturnValue({
        ...createJobPositionData(),
        tenantId,
      } as any);
      jobPositionRepository.save.mockResolvedValue(jobPositionData());

      const result = await jobPositionService.create(
        tenantId,
        createJobPositionData(),
      );
      expect(jobPositionRepository.create).toHaveBeenCalledWith({
        ...createJobPositionData(),
        tenantId,
      });
      expect(jobPositionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createJobPositionData().name,
          tenantId,
        }),
      );
      expect(result).toEqual(jobPositionData());
    });
  });

  describe('findOnePosition', () => {
    it('should return a job position if found', async () => {
      jobPositionRepository.findOneOrFail.mockResolvedValue(jobPositionData());

      const result = await jobPositionService.findOnePosition(
        jobPositionData().id,
      );
      expect(jobPositionRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: jobPositionData().id },
      });
      expect(result).toEqual(jobPositionData());
    });

    it('should throw NotFoundException if job position is not found', async () => {
      jobPositionRepository.findOneOrFail.mockRejectedValue(
        new Error('not found'),
      );

      await expect(
        jobPositionService.findOnePosition('nonexistent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated job positions', async () => {
      paginationService.paginate.mockResolvedValue(
        paginationResultJobPositionData(),
      );

      const result = await jobPositionService.findAll(
        paginationOptions(),
        {},
        'tenantId',
      );
      expect(paginationService.paginate).toHaveBeenCalledWith(
        jobPositionRepository,
        'JobPosition',
        {
          page: paginationOptions().page,
          limit: paginationOptions().limit,
        },
        paginationOptions().orderBy,
        paginationOptions().orderDirection,
        { tenantId: 'tenantId' },
      );
      expect(result).toEqual(paginationResultJobPositionData());
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if the job position does not exist', async () => {
      jobPositionRepository.findOneOrFail.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        jobPositionService.update(
          'nonexistent-id',
          'tenantId',
          updateJobPositionData(),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update and return the job position', async () => {
      const tenantId = 'tenantId';
      jobPositionRepository.findOneOrFail.mockResolvedValue(jobPositionData());

      await jobPositionService.update(
        jobPositionData().id,
        tenantId,
        updateJobPositionData(),
      );

      expect(jobPositionRepository.update).toHaveBeenCalledWith(
        jobPositionData().id,
        {
          ...updateJobPositionData(),
          tenantId,
        },
      );
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if the job position does not exist', async () => {
      jobPositionRepository.findOneOrFail.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(jobPositionService.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should soft delete a job position', async () => {
      jobPositionRepository.findOneOrFail.mockResolvedValue(jobPositionData());

      await jobPositionService.remove(jobPositionData().id);
      expect(jobPositionRepository.softDelete).toHaveBeenCalledWith({
        id: jobPositionData().id,
      });
    });
  });
});
