import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateNationalityDto } from '../dto/create-nationality.dto';
import { Nationality } from '../entities/nationality.entity';
import { UpdateNationalityDto } from '../dto/update-nationality.dto';

export const nationalityData = (): Nationality => {
  return {
    id: '1',
    name: 'American',
    tenantId: 'tenant-id',
    createdAt: new Date('2022-10-22 07:11:42'),
    updatedAt: new Date('2022-10-22 07:11:42'),
    deletedAt: null,
    employeeInformation: [], // Empty array if no related data
  };
};

export const createNationality = (): CreateNationalityDto => {
  return {
    name: 'American',
  };
};

export const updateNationalityData = (): UpdateNationalityDto => {
  return {
    name: 'Canadian',
  };
};

export const findAllNationalities = (): Pagination<Nationality> => {
  return {
    items: [nationalityData()],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };
};

export const updateNationality = () => {
  return {
    raw: [],
    generatedMaps: [],
    affected: 1,
  };
};

export const deleteNationality = () => {
  return {
    raw: [],
    affected: 1,
    generatedMaps: [],
  };
};
