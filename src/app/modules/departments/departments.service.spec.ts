import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsService } from './departments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { TreeRepository } from 'typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import {
  createdepartmentData,
  departmentData,
  updatedepartmentData,
  createdepartmentDataOnCreate,
  departmentsData,
} from './tests/department.data';
import { MockProxy } from 'jest-mock-extended';

describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let repository: MockProxy<TreeRepository<Department>>;
  const departmentToken = getRepositoryToken(Department);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        PaginationService,
        {
          provide: getRepositoryToken(Department),
          useClass: TreeRepository,
        },
      ],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
    repository = module.get(departmentToken);
    // repository = module.get<TreeRepository<Department>>(
    //   getRepositoryToken(Department),
    // );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('createDepartment', () => {
  //   it('should create a new department', async () => {
  //     const createDepartmentDto: CreateDepartmentDto = createdepartmentData();
  //     const tenantId = 'tenant1';
  //     const newDepartment = {
  //       ...createDepartmentDto,
  //       tenantId,
  //       level: 0,
  //     };
  //     const savedDepartment = departmentData();

  //     jest.spyOn(repository, 'save').mockResolvedValue(savedDepartment);
  //     jest.spyOn(repository, 'findOne').mockResolvedValue(savedDepartment);
  //     jest.spyOn(service, 'findAllDepartments').mockResolvedValue(savedDepartment);
  //     const result = await service.createDepartment(createDepartmentDto, tenantId);

  //     expect(repository.save).toHaveBeenCalledWith(newDepartment);
  //     // expect(result).toEqual(departmentsData());
  //   });

  //   it('should throw a BadRequestException on error', async () => {
  //     const createDepartmentDto: CreateDepartmentDto = createdepartmentData();
  //     const tenantId = 'tenant1';
  //     jest.spyOn(repository, 'save').mockRejectedValue(new Error('Department with Name New Department Already exist'));

  //     await expect(service.createDepartment(createDepartmentDto, tenantId)).rejects.toThrow(BadRequestException);
  //   });
  // });

  describe('findAllDepartments', () => {
    it('should return the department tree when departments exist', async () => {
      const tenantId = 'tenant-id-123';

      const department = new Department();
      department.id = '1';
      department.tenantId = tenantId;

      const departmentTree = { ...department, children: [], level: 0 };

      jest.spyOn(repository, 'find').mockResolvedValue([department]);
      jest
        .spyOn(repository, 'findDescendantsTree')
        .mockResolvedValue(departmentTree);

      const result = await service.findAllDepartments(tenantId);
      expect(result).toEqual(departmentTree);
      expect(repository.find).toHaveBeenCalledWith({ where: { tenantId } });
      expect(repository.findDescendantsTree).toHaveBeenCalledWith(department);
    });


    it('should throw NotFoundException if no departments are found', async () => {
      const tenantId = 'tenant-id-123';

      jest.spyOn(repository, 'find').mockResolvedValue([]);

      await expect(service.findAllDepartments(tenantId)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.find).toHaveBeenCalledWith({ where: { tenantId } });
    });

    it('should throw BadRequestException if an error occurs', async () => {
      const tenantId = 'tenant-id-123';
      const error = new Error('Something went wrong');

      jest.spyOn(repository, 'find').mockRejectedValue(error);

      await expect(service.findAllDepartments(tenantId)).rejects.toThrow(
        BadRequestException,
      );

    });
  });

  describe('findOneDepartment', () => {
    it('should return a department with descendants', async () => {
      const department = departmentData();
      jest
        .spyOn(repository, 'findOneByOrFail')
        .mockResolvedValue(department as any);
      jest
        .spyOn(repository, 'findDescendantsTree')
        .mockResolvedValue(department as any);

      const result = await service.findOneDepartment('1');

      expect(result).toEqual(department);
    });

    it('should throw a NotFoundException if department not found', async () => {
      jest
        .spyOn(repository, 'findOneByOrFail')
        .mockRejectedValue(new Error('Not Found'));

      await expect(service.findOneDepartment('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // describe('updateDepartment', () => {
  //   it('should update a department', async () => {
  //     const updateDepartmentDto: UpdateDepartmentDto = {
  //       id: '1',
  //       name: 'Updated Department',
  //       description: 'Updated Description',
  //       branchId: '1',
  //       department: [],
  //     };
  //     const department = departmentData();
  //     const updatedDepartment = updatedepartmentData();

  //     jest.spyOn(service, 'findOneDepartment').mockResolvedValue(department as any);
  //     jest.spyOn(repository, 'save').mockResolvedValue(updatedDepartment);

  //     const result = await service.updateDepartment('1', updateDepartmentDto);

  //     expect(result).toEqual(updatedDepartment);
  //     expect(repository.save).toHaveBeenCalledWith({
  //       ...updateDepartmentDto,
  //       id: '1', // Include the id in the object to match the actual behavior
  //       tenantId: 'tenant1', // Ensure this is included if it's a required field
  //     });
  //   });

  //   it('should throw a NotFoundException if department not found', async () => {
  //     const updateDepartmentDto: UpdateDepartmentDto = {
  //       id: '1',
  //       name: 'Updated Department',
  //       description: 'Updated Description',
  //       branchId: '1',
  //       department: [],
  //     };
  //     jest.spyOn(service, 'findOneDepartment').mockRejectedValue(new NotFoundException());

  //     await expect(service.updateDepartment('1', updateDepartmentDto)).rejects.toThrow(NotFoundException);
  //   });
  // });

  describe('removeDepartment', () => {
    it('should remove a department', async () => {
      const department = departmentData();
      jest
        .spyOn(service, 'findOneDepartment')
        .mockResolvedValue(department as any);
      jest.spyOn(repository, 'softDelete').mockResolvedValue({} as any);

      const result = await service.removeDepartment('1');

      expect(result).toEqual(department);
      expect(repository.softDelete).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if department not found', async () => {
      jest
        .spyOn(service, 'findOneDepartment')
        .mockRejectedValue(new NotFoundException());

      await expect(service.removeDepartment('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
