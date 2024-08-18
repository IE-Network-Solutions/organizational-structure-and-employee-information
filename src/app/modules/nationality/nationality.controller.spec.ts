import { Test } from '@nestjs/testing';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { NationalitysController } from './nationality.controller';
import { NationalityService } from './nationality.service';
import { Nationality } from './entities/nationality.entity';
import {
  createNationality,
  findAllNationalities,
  nationalityData,
} from './tests/nationality.data';
import { UpdateNationalityDto } from './dto/update-nationality.dto';

jest.mock('./nationality.service');

describe('RoleController', () => {
  let nationalitysController: NationalitysController;
  let nationalityService: NationalityService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [NationalitysController],
      providers: [NationalityService],
    }).compile();

    nationalitysController = moduleRef.get<NationalitysController>(
      NationalitysController,
    );
    nationalityService = moduleRef.get<NationalityService>(NationalityService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let nationality: Nationality;
      let request: Request;

      beforeEach(async () => {
        request = {
          tenantId: 'tenantId',
        } as any;
        (nationalityService.create as jest.Mock).mockResolvedValue(
          nationalityData(),
        );
        nationality = await nationalitysController.create(
          createNationality(),
          request as any,
        );
      });

      test('then it should return a nationality', () => {
        expect(nationality).toEqual(nationalityData());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let request: Request;

      beforeEach(async () => {
        request = {
          tenantId: 'tenantId', // Mock tenantId
        } as any;

        (nationalityService.findAll as jest.Mock).mockResolvedValue(
          findAllNationalities(),
        );

        await nationalitysController.findAll(paginationOptions());
      });

      test('then it should call nationalityService.findAll with correct parameters', () => {
        expect(nationalityService.findAll).toHaveBeenCalledWith(
          paginationOptions(),
        );
      });

      test('then it should return all natinalities', async () => {
        const result = await nationalitysController.findAll(
          paginationOptions(),
        );
        expect(result).toEqual(findAllNationalities());
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let nationality: Nationality;

      beforeEach(async () => {
        nationality = await nationalitysController.findOne(
          nationalityData().id,
        );
      });

      test('then it should call nationalityService', () => {
        expect(nationalityService.findOne).toHaveBeenCalledWith(
          nationalityData().id,
        );
      });

      test('then it should return nationality', () => {
        expect(nationality).toEqual(nationalityData());
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let nationality: Nationality;
      let updateNationalityDto: UpdateNationalityDto;
      let request: Request;

      beforeEach(async () => {
        request = {
          tenantId: 'tenantId',
        } as any;

        (nationalityService.update as jest.Mock).mockResolvedValue(
          nationalityData(),
        );

        nationality = await nationalitysController.update(
          nationalityData().id,
          updateNationalityDto,
        );
      });

      test('then it should call nationalityService.update with correct parameters', () => {
        expect(nationalityService.update).toHaveBeenCalledWith(
          nationalityData().id,
          updateNationalityDto,
        );
      });

      test('then it should return the updated nationality', () => {
        expect(nationality).toEqual(nationalityData());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        await nationalitysController.remove(nationalityData().id);
      });

      test('then it should call remove', () => {
        expect(nationalityService.remove).toHaveBeenCalledWith(
          nationalityData().id,
        );
      });

      test('then it should return a nationality', async () => {
        expect(
          await nationalitysController.remove(nationalityData().id),
        ).toEqual('Promise resolves with void');
      });
    });
  });
});
