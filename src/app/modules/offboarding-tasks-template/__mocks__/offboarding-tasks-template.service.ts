import { NotFoundException } from '@nestjs/common';
import {
  findAllOffboardingTasksTemplates,
  offboardingTasksTemplateData,
} from '../tests/offboarding-tasks-template..data';

export const OffboardingTasksTemplateService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(offboardingTasksTemplateData()),
  findAll: jest.fn().mockResolvedValue(findAllOffboardingTasksTemplates()),
  findOne: jest
    .fn()
    .mockImplementation((id) =>
      id === offboardingTasksTemplateData().id
        ? Promise.resolve(offboardingTasksTemplateData())
        : Promise.reject(
            new NotFoundException(`Template with id ${id} not found.`),
          ),
    ),
  update: jest
    .fn()
    .mockImplementation((id) =>
      id === offboardingTasksTemplateData().id
        ? Promise.resolve(offboardingTasksTemplateData())
        : Promise.reject(
            new NotFoundException(`Template with id ${id} not found.`),
          ),
    ),
  remove: jest
    .fn()
    .mockImplementation((id) =>
      id === offboardingTasksTemplateData().id
        ? Promise.resolve('Promise resolves with void')
        : Promise.reject(
            new NotFoundException(`Template with id ${id} not found.`),
          ),
    ),
});
