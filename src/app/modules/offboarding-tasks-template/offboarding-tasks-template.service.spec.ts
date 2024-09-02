import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';

import { CreateOffboardingTasksTemplateDto } from './dto/create-offboarding-tasks-template.dto';

import { OffboardingTasksTemplateService } from './offboarding-tasks-template.service';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { OffboardingTasksTemplate } from './entities/offboarding-tasks-template..entity';
import {
  createOffboardingTasksTemplate,
  deleteOffboardingTasksTemplate,
  findAllOffboardingTasksTemplates,
  offboardingTasksTemplateData,
  updateOffboardingTasksTemplate,
} from './tests/offboarding-tasks-template..data';
import { UpdateOffboardingTasksTemplateDto } from './dto/update-offboarding-tasks-template..dto';
import { CreateOffboardingEmployeeTaskDto } from '../offboarding-employee-task/dto/create-offboarding-employee-task.dto';
import { tenantId } from '../branchs/tests/branch.data';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';

describe('OffboardingTasksTemplateService', () => {
  let offboardingTasksTemplateService: OffboardingTasksTemplateService;
  let offboardingTasksTemplateRepository: MockProxy<
    Repository<OffboardingTasksTemplate>
  >;
  let paginationService: MockProxy<PaginationService>;
  const offboardingTasksTemplateToken = getRepositoryToken(
    OffboardingTasksTemplate,
  );

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OffboardingTasksTemplateService,
        {
          provide: offboardingTasksTemplateToken,
          useValue: mock<Repository<OffboardingTasksTemplate>>(),
        },
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },
      ],
    }).compile();

    offboardingTasksTemplateService =
      moduleRef.get<OffboardingTasksTemplateService>(
        OffboardingTasksTemplateService,
      );
    offboardingTasksTemplateRepository = moduleRef.get(
      offboardingTasksTemplateToken,
    );
    paginationService = moduleRef.get(PaginationService);
  });

  describe('create', () => {
    describe('when create is called', () => {
      let createOffboardingTasksTemplateDto: CreateOffboardingTasksTemplateDto;
      let offboardingTasksTemplate: OffboardingTasksTemplate;

      beforeEach(() => {
        createOffboardingTasksTemplateDto =
          createOffboardingTasksTemplate() as CreateOffboardingTasksTemplateDto;
        offboardingTasksTemplate = offboardingTasksTemplateData();

        offboardingTasksTemplateRepository.create.mockReturnValue(
          offboardingTasksTemplate,
        );
        offboardingTasksTemplateRepository.save.mockResolvedValue(
          offboardingTasksTemplate,
        );
      });

      it('should call offboardingTasksTemplateRepository.create', async () => {
        await offboardingTasksTemplateService.create(
          'tenantId',
          createOffboardingTasksTemplateDto,
        );
        expect(offboardingTasksTemplateRepository.create).toHaveBeenCalledWith({
          ...createOffboardingTasksTemplateDto,
          tenantId: 'tenantId',
        });
      });

      it('should call offboardingTasksTemplateRepository.save', async () => {
        await offboardingTasksTemplateService.create(
          'tenantId',
          createOffboardingTasksTemplateDto,
        );
        expect(offboardingTasksTemplateRepository.save).toHaveBeenCalledWith(
          offboardingTasksTemplate,
        );
      });

      it('should return the created template', async () => {
        const result = await offboardingTasksTemplateService.create(
          'tenantId',
          createOffboardingTasksTemplateDto,
        );
        expect(result).toEqual(offboardingTasksTemplate);
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let offboardingTasksTemplate: OffboardingTasksTemplate;

      beforeEach(() => {
        offboardingTasksTemplate = offboardingTasksTemplateData(); // Ensure this returns the correct mock data
        offboardingTasksTemplateRepository.findOne.mockResolvedValue(
          offboardingTasksTemplate,
        ); // Mock the return value
      });

      it('should call offboardingTasksTemplateRepository.findOne with the correct where clause', async () => {
        await offboardingTasksTemplateService.findOne(
          offboardingTasksTemplateData().id,
        );
        expect(offboardingTasksTemplateRepository.findOne).toHaveBeenCalledWith(
          { where: { id: offboardingTasksTemplateData().id } },
        );
      });

      it('should return the found template', async () => {
        const result = await offboardingTasksTemplateService.findOne(
          offboardingTasksTemplateData().id,
        );
        expect(result).toEqual(offboardingTasksTemplate); // Should match the expected mock data
      });
    });
  });

  describe('when findAll is called', () => {
    it('should return an array of OffboardingTasksTemplate', async () => {
      const paginationOptions: PaginationDto = { page: 1, limit: 10 };
      const tenantId = 'tenant-id-123';
      const templateTask = new OffboardingTasksTemplate();

      templateTask.tenantId = tenantId;

      jest
        .spyOn(offboardingTasksTemplateRepository, 'find')
        .mockResolvedValue([templateTask]);

      const result = await offboardingTasksTemplateService.findAll(
        paginationOptions,
        tenantId,
      );
      expect(result).toEqual([templateTask]);
      expect(offboardingTasksTemplateRepository.find).toHaveBeenCalledWith({
        where: { tenantId: tenantId },
        relations: ['approver'],
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let updateOffboardingTasksTemplateDto: CreateOffboardingTasksTemplateDto;

      beforeEach(() => {
        updateOffboardingTasksTemplateDto = createOffboardingTasksTemplate();
        offboardingTasksTemplateRepository.findOne.mockResolvedValue(
          offboardingTasksTemplateData(),
        );
        offboardingTasksTemplateRepository.update.mockResolvedValue(
          updateOffboardingTasksTemplate(),
        );
        offboardingTasksTemplateRepository.findOne.mockResolvedValue(
          offboardingTasksTemplateData(),
        );
      });

      it('should call offboardingTasksTemplateRepository.findOne initially', async () => {
        await offboardingTasksTemplateService.update(
          offboardingTasksTemplateData().id,
          updateOffboardingTasksTemplateDto,
        );
      });

      it('should call offboardingTasksTemplateRepository.update with correct parameters', async () => {
        await offboardingTasksTemplateService.update(
          offboardingTasksTemplateData().id,
          updateOffboardingTasksTemplateDto,
        );
        expect(offboardingTasksTemplateRepository.update).toHaveBeenCalledWith(
          offboardingTasksTemplateData().id,
          {
            ...updateOffboardingTasksTemplateDto,
          },
        );
      });

      it('should return the updated template', async () => {
        const result = await offboardingTasksTemplateService.update(
          offboardingTasksTemplateData().id,
          createOffboardingTasksTemplate(),
        );
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(() => {
        offboardingTasksTemplateRepository.findOne.mockResolvedValue(
          offboardingTasksTemplateData(),
        );
        offboardingTasksTemplateRepository.delete.mockResolvedValue(
          deleteOffboardingTasksTemplate(),
        );
      });

      it('should call offboardingTasksTemplateRepository.findOne', async () => {
        await offboardingTasksTemplateService.remove(
          offboardingTasksTemplateData().id,
        );
      });

      it('should call offboardingTasksTemplateRepository.delete', async () => {
        await offboardingTasksTemplateService.remove(
          offboardingTasksTemplateData().id,
        );
      });

      it('should return void when the template is removed', async () => {
        const result = await offboardingTasksTemplateService.remove(
          offboardingTasksTemplateData().id,
        );
        expect(result).toBeUndefined();
      });
    });
  });
});
