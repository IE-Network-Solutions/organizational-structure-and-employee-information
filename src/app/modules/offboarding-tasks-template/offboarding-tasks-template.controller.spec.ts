import { Test } from '@nestjs/testing';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { OffboardingTasksTemplateController } from './offboarding-tasks-template.controller';
import { OffboardingTasksTemplateService } from './offboarding-tasks-template.service';
import { OffboardingTasksTemplate } from './entities/offboarding-tasks-template..entity';
import {
  createOffboardingTasksTemplate,
  findAllOffboardingTasksTemplates,
  offboardingTasksTemplateData,
} from './tests/offboarding-tasks-template..data';
import { UpdateOffboardingTasksTemplateDto } from './dto/update-offboarding-tasks-template..dto';

jest.mock('./offboarding-tasks-template.service');

describe('OffboardingTasksTemplateController', () => {
  let offboardingTasksTemplateController: OffboardingTasksTemplateController;
  let offboardingTasksTemplateService: OffboardingTasksTemplateService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [OffboardingTasksTemplateController],
      providers: [OffboardingTasksTemplateService],
    }).compile();

    offboardingTasksTemplateController =
      moduleRef.get<OffboardingTasksTemplateController>(
        OffboardingTasksTemplateController,
      );
    offboardingTasksTemplateService =
      moduleRef.get<OffboardingTasksTemplateService>(
        OffboardingTasksTemplateService,
      );

    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let offboardingTasksTemplate: OffboardingTasksTemplate;
      let request: Request;

      beforeEach(async () => {
        request = {
          tenantId: 'tenant-id-123',
        } as any;

        (offboardingTasksTemplateService.create as jest.Mock).mockResolvedValue(
          offboardingTasksTemplateData(),
        );
        offboardingTasksTemplate =
          await offboardingTasksTemplateController.create(
            request,
            createOffboardingTasksTemplate(),
          );
      });

      test('then it should call offboardingTasksTemplateService.create with correct parameters', () => {
        expect(offboardingTasksTemplateService.create).toHaveBeenCalledWith(
          'tenant-id-123',
          createOffboardingTasksTemplate(),
        );
      });

      test('then it should return a template', () => {
        expect(offboardingTasksTemplate).toEqual(
          offboardingTasksTemplateData(),
        );
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let request: Request;

      beforeEach(async () => {
        request = {
          tenantId: 'tenant-id-123',
        } as any;

        (
          offboardingTasksTemplateService.findAll as jest.Mock
        ).mockResolvedValue(findAllOffboardingTasksTemplates());

        await offboardingTasksTemplateController.findAll(
          request,
          paginationOptions(),
        );
      });

      test('then it should call offboardingTasksTemplateService.findAll with correct parameters', () => {
        expect(offboardingTasksTemplateService.findAll).toHaveBeenCalledWith(
          paginationOptions(),
          offboardingTasksTemplateData().tenantId,
        );
      });

      test('then it should return all templates', async () => {
        const result = await offboardingTasksTemplateController.findAll(
          request,
          paginationOptions(),
        );
        expect(result).toEqual(findAllOffboardingTasksTemplates());
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let offboardingTasksTemplate: OffboardingTasksTemplate;

      beforeEach(async () => {
        offboardingTasksTemplate =
          await offboardingTasksTemplateController.findOne(
            offboardingTasksTemplateData().id,
          );
      });

      test('then it should call offboardingTasksTemplateService', () => {
        expect(offboardingTasksTemplateService.findOne).toHaveBeenCalledWith(
          offboardingTasksTemplateData().id,
        );
      });

      test('then it should return a template', () => {
        expect(offboardingTasksTemplate).toEqual(
          offboardingTasksTemplateData(),
        );
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let offboardingTasksTemplate: OffboardingTasksTemplate;
      let updateOffboardingTasksTemplateDto: UpdateOffboardingTasksTemplateDto;
      let request: Request;

      beforeEach(async () => {
        request = {
          tenantId: 'tenantId',
        } as any;

        (offboardingTasksTemplateService.update as jest.Mock).mockResolvedValue(
          offboardingTasksTemplateData(),
        );

        offboardingTasksTemplate =
          await offboardingTasksTemplateController.update(
            offboardingTasksTemplateData().id,
            updateOffboardingTasksTemplateDto,
          );
      });

      test('then it should call offboardingTasksTemplateService.update with correct parameters', () => {
        expect(offboardingTasksTemplateService.update).toHaveBeenCalledWith(
          offboardingTasksTemplateData().id,
          updateOffboardingTasksTemplateDto,
        );
      });

      test('then it should return the updated template', () => {
        expect(offboardingTasksTemplate).toEqual(
          offboardingTasksTemplateData(),
        );
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        await offboardingTasksTemplateController.remove(
          offboardingTasksTemplateData().id,
        );
      });

      test('then it should call remove', () => {
        expect(offboardingTasksTemplateService.remove).toHaveBeenCalledWith(
          offboardingTasksTemplateData().id,
        );
      });

      test('then it should return void', async () => {
        expect(
          await offboardingTasksTemplateController.remove(
            offboardingTasksTemplateData().id,
          ),
        ).toEqual('Promise resolves with void');
      });
    });
  });
});
