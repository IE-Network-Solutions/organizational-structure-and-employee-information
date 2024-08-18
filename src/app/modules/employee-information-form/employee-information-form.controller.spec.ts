import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeInformationFormService } from './employee-information-form.service';
import { EmployeeInformationFormsController } from './employee-information-form.controller';
import {
  employeeInformationFormData,
  paginatedEmployeeInformationForms,
} from './tests/employee-job-information.data';
import { EmployeeInformationForm } from './entities/employee-information-form.entity';

jest.mock('./employee-information-form.service');

describe('EmployeeInformationFormsController', () => {
  let controller: EmployeeInformationFormsController;
  let service: EmployeeInformationFormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeInformationFormsController],
      providers: [EmployeeInformationFormService],
    }).compile();

    controller = module.get<EmployeeInformationFormsController>(
      EmployeeInformationFormsController,
    );
    service = module.get<EmployeeInformationFormService>(
      EmployeeInformationFormService,
    );
    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let employeeInformationForm: EmployeeInformationForm;
      const mockRequest = { tenantId: 'tenant-1' } as any;

      beforeEach(async () => {
        jest
          .spyOn(service, 'create')
          .mockResolvedValue(employeeInformationFormData());

        employeeInformationForm = await controller.create(
          employeeInformationFormData(),
          mockRequest,
        );
      });

      test('then it should return the created employee job information', () => {
        expect(employeeInformationForm).toEqual(employeeInformationFormData());
      });
    });
  });

  describe('findAll', () => {
    it('should call EmployeeInformationFormService.findAll with correct parameters and return paginated data', async () => {
      const options = { page: 1, limit: 10 };
      jest
        .spyOn(service, 'findAll')
        .mockResolvedValue(paginatedEmployeeInformationForms());

      expect(await controller.findAll(options)).toEqual(
        paginatedEmployeeInformationForms(),
      );
      expect(service.findAll).toHaveBeenCalledWith(options);
    });
  });

  describe('findOne', () => {
    it('should call EmployeeInformationFormService.findOne with correct id and return a single entity', async () => {
      const id = '1234567890';
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(employeeInformationFormData());

      expect(await controller.findOne(id)).toEqual(
        employeeInformationFormData(),
      );
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('remove', () => {
    it('should call EmployeeInformationFormService.remove with correct id and return a confirmation message', async () => {
      const id = '1234567890';
      jest.spyOn(service, 'remove').mockResolvedValue(undefined); // Assuming remove returns void

      expect(await controller.remove(id)).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
