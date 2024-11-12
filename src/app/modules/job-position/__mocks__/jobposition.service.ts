import { CreateJobPositionDto } from '../dto/create-job-position.dto';
import {
  createJobPositionData,
  deleteJobPositionData,
  findOneNotFoundReturnValue,
  jobPositionData,
  paginationResultJobPositionData,
  updateJobPositionData,
} from '../tests/jobposition.data';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { UpdateJobPositionDto } from '../dto/update-job-position.dto';

export const JobPositionService = jest.fn().mockReturnValue({
  // Mock implementation for creating a job position
  create: jest
    .fn()
    .mockImplementation((tenantId: string, dto: CreateJobPositionDto) => {
      return Promise.resolve(createJobPositionData());
    }),

  // Mock implementation for finding all job positions
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

  // Mock implementation for finding a job position by id
  findOnePosition: jest.fn().mockImplementation((id: string) => {
    if (id === '4567') {
      return Promise.resolve(findOneNotFoundReturnValue());
    }
    return Promise.resolve(jobPositionData());
  }),

  // Mock implementation for updating a job position
  update: jest
    .fn()
    .mockImplementation(
      (id: string, tenantId: string, dto: UpdateJobPositionDto) => {
        return Promise.resolve(updateJobPositionData());
      },
    ),

  // Mock implementation for removing a job position by id
  remove: jest.fn().mockImplementation((id: string) => {
    return Promise.resolve(deleteJobPositionData());
  }),
});
