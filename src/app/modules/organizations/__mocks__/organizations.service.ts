import { NotFoundException } from '@nestjs/common';
import {
  organizationData,
  paginationResultOrganizationData,
} from '../tests/organization.data';

export const OrganizationsService = jest.fn().mockReturnValue({
  createOrganiztion: jest.fn().mockResolvedValue(organizationData()),
  // create: jest.fn().mockResolvedValue(createorganizationData()),

  // save: jest.fn().mockResolvedValue(organizationData()),
  findAllOrganizations: jest
    .fn()
    .mockResolvedValue(paginationResultOrganizationData()),
  findOneOrganization: jest
    .fn()
    .mockImplementation((id) =>
      id === organizationData().id
        ? Promise.resolve(organizationData())
        : Promise.reject(
            new NotFoundException(`organization with id ${id} not found`),
          ),
    ),

  updateOrganization: jest
    .fn()
    .mockImplementation((id) =>
      id === organizationData().id
        ? Promise.resolve(organizationData())
        : Promise.reject(new Error(`organization with id ${id} not found.`)),
    ),

  removeOrganization: jest
    .fn()
    .mockImplementation((id) =>
      id === organizationData().id
        ? Promise.resolve(organizationData())
        : Promise.reject(new Error(`organization with id ${id} not found.`)),
    ),
});
