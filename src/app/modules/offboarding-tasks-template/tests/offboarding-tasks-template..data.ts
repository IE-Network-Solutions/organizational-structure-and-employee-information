import { Pagination } from 'nestjs-typeorm-paginate';
import { OffboardingTasksTemplate } from '../entities/offboarding-tasks-template..entity';
import { CreateOffboardingTasksTemplateDto } from '../dto/create-offboarding-tasks-template.dto';

export const offboardingTasksTemplateData = (): OffboardingTasksTemplate => {
  return {
    id: 'template-id-123',
    title: 'Return Company Equipment',
    description: 'Ensure all company equipment is returned.',
    approverId: 'approver-id-789',
    tenantId: 'tenant-id-123',
    createdAt: new Date('2022-10-22 07:11:42'),
    updatedAt: new Date('2022-10-22 07:11:42'),
    deletedAt: null,
  };
};

export const createOffboardingTasksTemplate = (): CreateOffboardingTasksTemplateDto => {
  return {
    title: 'Submit Final Report',
    description: 'Submit a final report of all tasks completed.',
    approverId: 'approver-id-789',
    tenantId: 'tenant-id-123'
  };
};

export const findAllOffboardingTasksTemplates = (): Pagination<OffboardingTasksTemplate> => {
  return {
    items: [offboardingTasksTemplateData()],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };
};

export const updateOffboardingTasksTemplate = () => {
  return {
    raw: [],
    generatedMaps: [],
    affected: 1,
  };
};

export const deleteOffboardingTasksTemplate = () => {
  return {
    raw: [],
    affected: 1,
    generatedMaps: [],
  };
};
