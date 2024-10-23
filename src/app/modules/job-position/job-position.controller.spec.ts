import { Test, TestingModule } from '@nestjs/testing';
import { PaginationDto } from '../core/commonDto/pagination-dto';
import { CreateJobPositionDto } from './dto/create-job-position.dto';
import { UpdateJobPositionDto } from './dto/update-job-position.dto';
import { JobPositionController } from './job-position.controller';
import { JobPositionService } from './job-position.service';
import {
  createJobPositionData,
  deleteJobPositionData,
  findOneNotFoundReturnValue,
  jobPositionData,
  paginationResultJobPositionData,
  updateJobPositionData,
  updateJobPositionDataReturned,
} from './tests/jobposition.data';

jest.mock('./job-position.service');

describe('JobPositionController', () => {
  let controller: JobPositionController;
  let service: JobPositionService;

  const mockJobPositionService = {
    create: jest
      .fn()
      .mockImplementation((tenantId: string, dto: CreateJobPositionDto) => {
        return Promise.resolve(createJobPositionData());
      }),
    findAll: jest
      .fn()
      .mockImplementation(
        (
          paginationOptions: PaginationDto,
          searchFilterDTO: any,
          tenantId: string,
        ) => {
          return Promise.resolve(paginationResultJobPositionData());
        },
      ),
    findOnePosition: jest.fn().mockImplementation((id: string) => {
      if (id === '4567') {
        return Promise.resolve(findOneNotFoundReturnValue());
      }
      return Promise.resolve(jobPositionData());
    }),
    update: jest
      .fn()
      .mockImplementation(
        (id: string, tenantId: string, dto: UpdateJobPositionDto) => {
          return Promise.resolve(updateJobPositionDataReturned());
        },
      ),
    remove: jest.fn().mockImplementation((id: string) => {
      return Promise.resolve(deleteJobPositionData());
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobPositionController],
      providers: [
        {
          provide: JobPositionService,
          useValue: mockJobPositionService,
        },
      ],
    }).compile();

    controller = module.get<JobPositionController>(JobPositionController);
    service = module.get<JobPositionService>(JobPositionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a job position', async () => {
    const createJobPositionDto: CreateJobPositionDto = createJobPositionData();
    const req = { tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c' } as any;
    const result = await controller.create(req, createJobPositionDto);
    expect(result).toEqual(createJobPositionData());
    expect(service.create).toHaveBeenCalledWith(
      '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
      createJobPositionDto,
    );
  });

  it('should find all job positions', async () => {
    const paginationOptions: PaginationDto = { page: 1, limit: 10 };
    const req = { tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c' } as any;
    const searchFilterDTO = {};
    const result = await controller.findAll(
      req,
      paginationOptions,
      searchFilterDTO,
    );
    expect(result).toEqual(paginationResultJobPositionData());
    expect(service.findAll).toHaveBeenCalledWith(
      paginationOptions,
      searchFilterDTO,
      '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    );
  });

  it('should find one job position', async () => {
    const result = await controller.findOnePosition(
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    );
    expect(result).toEqual(jobPositionData());
    expect(service.findOnePosition).toHaveBeenCalledWith(
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    );
  });

  it('should return not found for non-existent job position', async () => {
    const result = await controller.findOnePosition('4567');
    expect(result).toEqual(findOneNotFoundReturnValue());
    expect(service.findOnePosition).toHaveBeenCalledWith('4567');
  });

  it('should update a job position', async () => {
    const updateJobPositionDto: UpdateJobPositionDto = updateJobPositionData();
    const req = { tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c' } as any;
    const result = await controller.update(
      req,
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
      updateJobPositionDto,
    );
    expect(result).toEqual(updateJobPositionDataReturned());
    expect(service.update).toHaveBeenCalledWith(
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
      '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
      updateJobPositionDto,
    );
  });

  it('should remove a job position', async () => {
    const result = await controller.remove(
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    );
    expect(result).toEqual(deleteJobPositionData());
    expect(service.remove).toHaveBeenCalledWith(
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    );
  });
});
