import { Test } from '@nestjs/testing';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { Organization } from './entities/organization.entity';
import {
  createOrganizationData,
  organizationData,
  paginationResultOrganizationData,
} from './tests/organization.data';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';

jest.mock('./organizations.service');

describe('OrganizationsController', () => {
  let organizationsController: OrganizationsController;
  let organizationsService: OrganizationsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [OrganizationsService],
    }).compile();

    organizationsController = moduleRef.get<OrganizationsController>(
      OrganizationsController,
    );
    organizationsService =
      moduleRef.get<OrganizationsService>(OrganizationsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when createOrganiztion is called', () => {
      let organization: Organization;
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';

      beforeEach(async () => {
        (organizationsService.createOrganiztion as jest.Mock).mockResolvedValue(
          organizationData(),
        );
        organization = await organizationsController.createOrganiztion(
          { tenantId } as any,
          createOrganizationData(),
        );
      });

      test('then it should call OrganizationsService', () => {
        expect(organizationsService.createOrganiztion).toHaveBeenCalledWith(
          createOrganizationData(),
          tenantId,
        );
      });

      test('then it should return an organization', () => {
        expect(organization).toEqual(organizationData());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAllOrganizations is called', () => {
      beforeEach(async () => {
        (
          organizationsService.findAllOrganizations as jest.Mock
        ).mockResolvedValue(paginationResultOrganizationData());
        await organizationsController.findAllOrganizations(
          { tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c' } as any,
          paginationOptions(),
        );
      });

      test('then it should call OrganizationsService', () => {
        expect(organizationsService.findAllOrganizations).toHaveBeenCalledWith(
          paginationOptions(),
          '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
        );
      });

      test('then it should return paginated result of organizations', async () => {
        expect(
          await organizationsController.findAllOrganizations(
            { tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c' } as any,
            paginationOptions(),
          ),
        ).toEqual(paginationResultOrganizationData());
      });
    });
  });

  describe('findOne', () => {
    describe('when findOneOrganization is called', () => {
      let organization: Organization;

      beforeEach(async () => {
        (
          organizationsService.findOneOrganization as jest.Mock
        ).mockResolvedValue(organizationData());
        organization = await organizationsController.findOneOrganization(
          organizationData().id,
        );
      });

      test('then it should call OrganizationsService', () => {
        expect(organizationsService.findOneOrganization).toHaveBeenCalledWith(
          organizationData().id,
        );
      });

      test('then it should return an organization', () => {
        expect(organization).toEqual(organizationData());
      });
    });
  });

  describe('update', () => {
    describe('when updateOrganization is called', () => {
      let organization: Organization;
      const updateOrganizationData = {
        ...organizationData(),
        name: 'Updated Organization',
      };

      beforeEach(async () => {
        (
          organizationsService.updateOrganization as jest.Mock
        ).mockResolvedValue(updateOrganizationData);
        organization = await organizationsController.updateOrganization(
          { tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c' } as any,
          organizationData().id,
          updateOrganizationData,
        );
      });

      test('then it should call OrganizationsService', () => {
        expect(organizationsService.updateOrganization).toHaveBeenCalledWith(
          '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
          organizationData().id,
          updateOrganizationData,
        );
      });

      test('then it should return an updated organization', () => {
        expect(organization).toEqual(updateOrganizationData);
      });
    });
  });

  describe('remove', () => {
    describe('when removeOrganization is called', () => {
      let organization: Organization;

      beforeEach(async () => {
        (
          organizationsService.removeOrganization as jest.Mock
        ).mockResolvedValue(organizationData());
        organization = await organizationsController.removeOrganization(
          organizationData().id,
        );
      });

      test('then it should call OrganizationsService', () => {
        expect(organizationsService.removeOrganization).toHaveBeenCalledWith(
          organizationData().id,
        );
      });

      test('then it should return a removed organization', async () => {
        expect(
          await organizationsController.removeOrganization(
            organizationData().id,
          ),
        ).toEqual(organizationData());
      });
    });
  });
});
