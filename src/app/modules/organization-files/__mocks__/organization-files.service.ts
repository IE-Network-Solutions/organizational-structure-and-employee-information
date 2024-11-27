import { NotFoundException } from '@nestjs/common';
import {
  mockOrganizationFile,
  mockOrganizationFileCreateData,
} from '../tests/organization-files.data';

export const OrganizationFilesService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue({
    ...mockOrganizationFileCreateData,
    id: mockOrganizationFile.id,
    createdAt: mockOrganizationFile.createdAt,
    updatedAt: mockOrganizationFile.updatedAt,
  }),
  findAll: jest.fn().mockResolvedValue([mockOrganizationFile]),
  findOne: jest
    .fn()
    .mockImplementation((id) =>
      id === mockOrganizationFile.id
        ? Promise.resolve(mockOrganizationFile)
        : Promise.reject(
            new NotFoundException(`OrganizationFile with id ${id} not found.`),
          ),
    ),
  update: jest
    .fn()
    .mockImplementation((id, updateData) =>
      id === mockOrganizationFile.id
        ? Promise.resolve({ ...mockOrganizationFile, ...updateData })
        : Promise.reject(
            new NotFoundException(`OrganizationFile with id ${id} not found.`),
          ),
    ),
  remove: jest
    .fn()
    .mockImplementation((id) =>
      id === mockOrganizationFile.id
        ? Promise.resolve()
        : Promise.reject(
            new NotFoundException(`OrganizationFile with id ${id} not found.`),
          ),
    ),
});
