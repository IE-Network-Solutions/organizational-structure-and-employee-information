import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { NotFoundException } from '@nestjs/common';
import {
  createdepartmentData,
  departmentData,
  paginationResultdepartmentData,
  updatedepartmentData,
} from './tests/department.data';

describe('DepartmentsController', () => {
  let controller: DepartmentsController;
  let service: DepartmentsService;

  const mockDepartmentsService = {
    createDepartment: jest.fn().mockResolvedValue(departmentData()),
    findAllDepartments: jest
      .fn()
      .mockResolvedValue(paginationResultdepartmentData().items),
    findOneDepartment: jest.fn().mockImplementation((id: string) => {
      if (id === '4567') {
        throw new NotFoundException(`Department with Id ${id} not found`);
      }
      return departmentData();
    }),
    updateDepartment: jest.fn().mockResolvedValue(departmentData()),
    removeDepartment: jest.fn().mockResolvedValue(departmentData()),
    removeDepartmentWithShift: jest.fn().mockResolvedValue(departmentData()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentsController],
      providers: [
        { provide: DepartmentsService, useValue: mockDepartmentsService },
      ],
    }).compile();

    controller = module.get<DepartmentsController>(DepartmentsController);
    service = module.get<DepartmentsService>(DepartmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a department', async () => {
    const createDepartmentDto: CreateDepartmentDto = createdepartmentData();
    const req = { tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c' } as any;
    const result = await controller.createDepartment(req, createDepartmentDto);
    expect(result).toEqual(departmentData());
    expect(service.createDepartment).toHaveBeenCalledWith(
      createDepartmentDto,
      req.tenantId,
    );
  });

  it('should find all departments', async () => {
    const req = { tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c' } as any;
    const result = await controller.findAllDepartments(req);
    expect(result).toEqual(paginationResultdepartmentData().items);
    expect(service.findAllDepartments).toHaveBeenCalledWith(req.tenantId);
  });

  it('should find one department', async () => {
    const result = await controller.findOneDepartment(
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    );
    expect(result).toEqual(departmentData());
    expect(service.findOneDepartment).toHaveBeenCalledWith(
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    );
  });

  it('should throw not found exception for non-existent department', async () => {
    await expect(controller.findOneDepartment('4567')).rejects.toThrow(
      NotFoundException,
    );
    expect(service.findOneDepartment).toHaveBeenCalledWith('4567');
  });

  it('should update a department', async () => {
    const req = { tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c' } as any;
    const updateDepartmentDto: UpdateDepartmentDto = updatedepartmentData();
    const result = await controller.updateDepartment(
      req,
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
      updateDepartmentDto,
    );
    expect(result).toEqual(departmentData());
    expect(service.updateDepartment).toHaveBeenCalledWith(
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
      updateDepartmentDto,
      req.tenantId, // Ensure tenantId is passed here
    );
  });

  it('should remove a department', async () => {
    const req = { tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c' } as any;
    const result = await controller.removeDepartment(
      req,
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    );
    expect(result).toEqual(departmentData());
    expect(service.removeDepartmentWithShift).toHaveBeenCalledWith(
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
      req['tenantId'],
    );
  });

  it('should throw not found exception for remove of non-existent department', async () => {
    const req = { tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c' } as any;
    jest
      .spyOn(service, 'removeDepartmentWithShift')
      .mockImplementationOnce(() => {
        throw new NotFoundException(`Department with Id 4567 not found`);
      });
    await expect(
      controller.removeDepartment(
        req,
        'be21f28b-4651-4d6f-8f08-d8128da64ee5',
        'be21f28b-4651-4d6f-8f08-d8128da64ee5',
      ),
    ).rejects.toThrow(NotFoundException);
  });
});
