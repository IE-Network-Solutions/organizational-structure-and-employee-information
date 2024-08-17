import { NotFoundException } from '@nestjs/common';
import {
  findAllNationalities,
  nationalityData,
} from '../tests/nationality.data';

// import { paginationResultUserData, userData } from '../tests/user.data';

export const NationalityService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(nationalityData()),
  findAll: jest.fn().mockResolvedValue(findAllNationalities()),
  findOne: jest
    .fn()
    .mockImplementation((id) =>
      id === nationalityData().id
        ? Promise.resolve(nationalityData())
        : Promise.reject(new NotFoundException()),
    ),

  update: jest
    .fn()
    .mockImplementation((id) =>
      id === nationalityData().id
        ? Promise.resolve(nationalityData())
        : Promise.reject(new Error(`Nationality with id ${id} not found.`)),
    ),

  remove: jest
    .fn()
    .mockImplementation((id) =>
      id === nationalityData().id
        ? Promise.resolve('Promise resolves with void')
        : Promise.reject(new Error(`Nationality with id ${id} not found.`)),
    ),
});
