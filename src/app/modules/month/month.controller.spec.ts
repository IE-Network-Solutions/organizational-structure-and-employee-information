import { Test, TestingModule } from '@nestjs/testing';
import { MonthController } from './month.controller';
import { MonthService } from './month.service';
import { Month } from './entities/month.entity';
import { monthData, PaginationResultMonthData } from './tests/month.data';

jest.mock('./month.service.ts');

describe('MonthController', () => {
  let controller: MonthController;
  let service: MonthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonthController],
      providers: [MonthService],
    }).compile();

    controller = module.get<MonthController>(MonthController);
    service = module.get<MonthService>(MonthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createMonth', () => {
    describe('when createMonth is called', () => {
      let month: Month;
      const createMonthDto = monthData();
      const tenantId = 'tenant-1';

      beforeEach(async () => {
        jest.spyOn(service, 'createMonth').mockResolvedValue(monthData());
        month = await controller.createMonth(createMonthDto, tenantId);
      });

      test('then it should return the created month', () => {
        expect(month).toEqual(monthData());
      });

      test('then it should call MonthService.createMonth with correct parameters', () => {
        expect(service.createMonth).toHaveBeenCalledWith(
          createMonthDto,
          tenantId,
        );
      });
    });
  });

  describe('findAllMonths', () => {
    it('should call MonthService.findAllMonths with correct parameters and return paginated data', async () => {
      const paginationOptions = { page: 1, limit: 10 };
      const tenantId = 'some-tenant-id';

      jest
        .spyOn(service, 'findAllMonths')
        .mockResolvedValue(PaginationResultMonthData());

      const result = await controller.findAllMonths(
        tenantId,
        paginationOptions,
      );

      expect(result).toEqual(PaginationResultMonthData());
      expect(service.findAllMonths).toHaveBeenCalledWith(
        tenantId,
        paginationOptions,
      );
    });
  });

  describe('findOneMonth', () => {
    it('should call MonthService.findOneMonth with correct id and return a single entity', async () => {
      const id = '1234567890';

      jest.spyOn(service, 'findOneMonth').mockResolvedValue(monthData());

      const result = await controller.findOneMonth(id);

      expect(result).toEqual(monthData());
      expect(service.findOneMonth).toHaveBeenCalledWith(id);
    });
  });

  describe('updateMonth', () => {
    describe('when updateMonth is called', () => {
      let month: Month;
      const updateMonthDto = monthData();
      const id = '1234567890';
      const tenantId = 'tenant-1';

      beforeEach(async () => {
        jest.spyOn(service, 'updateMonth').mockResolvedValue(monthData());
        month = await controller.updateMonth(tenantId, id, updateMonthDto);
      });

      test('then it should return the updated month', () => {
        expect(month).toEqual(monthData());
      });

      test('then it should call MonthService.updateMonth with correct parameters', () => {
        expect(service.updateMonth).toHaveBeenCalledWith(
          id,
          updateMonthDto,
          tenantId,
        );
      });
    });
  });

  describe('removeMonth', () => {
    it('should call MonthService.removeMonth with correct id and return a confirmation message', async () => {
      const id = '1234567890';
      const tenantId = 'tenant-1';

      jest.spyOn(service, 'removeMonth').mockResolvedValue(undefined);

      const result = await controller.removeMonth(tenantId, id);

      expect(result).toBeUndefined();
      expect(service.removeMonth).toHaveBeenCalledWith(id);
    });
  });
});
