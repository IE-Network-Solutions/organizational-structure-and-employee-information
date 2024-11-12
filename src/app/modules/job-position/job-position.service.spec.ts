import { Repository } from 'typeorm';
import { JobPositionService } from './job-position.service';
import { mock, MockProxy } from 'jest-mock-extended';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import {
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  createJobPositionData,
  deleteJobPositionData,
  jobPositionData,
  paginationResultJobPositionData,
  updateJobPositionData,
  updateJobPositionDataReturned,
} from './tests/jobposition.data';

import { JobPosition } from './entities/job-position.entity';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';

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
          useValue: mock<Repository<JobPosition>>(),
        },
      ],
    }).compile();

    jobPositionService = moduleRef.get<JobPositionService>(JobPositionService);
    jobPositionRepository = moduleRef.get(jobPositionToken);
  });

  describe('create', () => {
    it('should create and return a new job position', async () => {
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      jobPositionRepository.findOne.mockResolvedValue(undefined); // No conflict
      jobPositionRepository.create.mockReturnValue({
        ...jobPositionData(),
        tenantId,
      } as any);
      jobPositionRepository.save.mockResolvedValue(jobPositionData());

      const result = await jobPositionService.create(
        tenantId,
        jobPositionData(),
      );
      expect(jobPositionRepository.create).toHaveBeenCalledWith({
        ...jobPositionData(),
        tenantId,
      });
      expect(jobPositionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: jobPositionData().name,
          tenantId,
        }),
      );
      expect(result).toEqual(jobPositionData());
    });
  });
  describe('findOne', () => {
    describe('when findOneJobPoJobPosition is called', () => {
      let jobPosition: JobPosition;

      beforeEach(async () => {
        await jobPositionRepository.findOneByOrFail.mockResolvedValue(
          jobPositionData(),
        );
        jobPosition = await jobPositionService.findOnePosition(
          jobPositionData().id,
        );
      });

      it('should callJobPositionRepository.findOne', async () => {
        await jobPositionService.findOnePosition(jobPositionData().id);
        expect(jobPositionRepository.findOneByOrFail).toHaveBeenCalledWith({
          id: jobPositionData().id,
        });
      });

      it('should return theJobPosition', async () => {
        expect(
          await jobPositionService.findOnePosition(jobPositionData().id),
        ).toEqual(jobPositionData());
      });

      it('should throw NotFoundException if id is not found', async () => {
        const wrongId = '4567';
        jobPositionRepository.findOneByOrFail.mockRejectedValue(
          new Error(`Position with Id ${wrongId} not found`),
        );

        await expect(
          jobPositionService.findOnePosition(wrongId),
        ).rejects.toThrow(NotFoundException);
        await expect(
          jobPositionService.findOnePosition(wrongId),
        ).rejects.toThrow(`Position with Id ${wrongId} not found`);
      });
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
    describe('when updatejobPosition is called', () => {
      let jobPosition: JobPosition;
      let companyProfileImage: Express.Multer.File;
      beforeEach(async () => {
        jest
          .spyOn(jobPositionService, 'findOnePosition')
          .mockResolvedValue(jobPositionData());
        jobPositionRepository.update.mockResolvedValue(
          jobPositionData() as any,
        );
      });

      it('should call jobPositionService.findOnejobPosition', async () => {
        await jobPositionService.update(
          jobPositionData().id,
          jobPositionData().tenantId,
          createJobPositionData(),
        );
        expect(jobPositionService.findOnePosition).toHaveBeenCalledWith(
          jobPositionData().id,
        );
      });

      it('should call jobPositionRepository.update', async () => {
        await jobPositionService.update(
          jobPositionData().id,
          jobPositionData().tenantId,
          createJobPositionData(),
        );
        expect(jobPositionRepository.update).toHaveBeenCalledWith(
          jobPositionData().id,
          createJobPositionData(),
        );
      });

      it('should return the updated jobPosition', async () => {
        jobPosition = await jobPositionService.update(
          jobPositionData().id,
          jobPositionData().tenantId,
          createJobPositionData(),
        );
        expect(jobPosition).toEqual(jobPositionData());
      });

      it('should throw NotFoundException if id is not found', async () => {
        const wrongId = '4567';
        jest
          .spyOn(jobPositionService, 'findOnePosition')
          .mockRejectedValue(
            new NotFoundException(`Position with Id ${wrongId} not found`),
          );
        await expect(
          jobPositionService.update(
            wrongId,
            jobPositionData().tenantId,
            createJobPositionData(),
          ),
        ).rejects.toThrow(NotFoundException);
        await expect(
          jobPositionService.update(
            wrongId,
            jobPositionData().tenantId,
            createJobPositionData(),
          ),
        ).rejects.toThrow(`Position with id ${wrongId} not found`);
      });
    });
  });

  describe('remove', () => {
    describe('when removejobPosition is called', () => {
      beforeEach(async () => {
        jobPositionRepository.findOne.mockResolvedValue(jobPositionData());
        jobPositionRepository.softDelete.mockResolvedValue(
          deleteJobPositionData(),
        );
      });

      it('should call jobPositionRepository.delete', async () => {
        await jobPositionService.remove(jobPositionData().id);
        expect(jobPositionRepository.softDelete).toHaveBeenCalledWith({
          id: jobPositionData().id,
        });
      });

      it('should return void when the jobPosition is removed', async () => {
        const result = await jobPositionService.remove(jobPositionData().id);
        expect(await jobPositionService.remove(jobPositionData().id)).toEqual(
          deleteJobPositionData(),
        );
      });
    });
  });
});
