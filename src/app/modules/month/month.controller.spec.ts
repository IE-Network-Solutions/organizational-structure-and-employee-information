import { Test, TestingModule } from '@nestjs/testing';
import { MonthController } from './month.controller';
import { MonthService } from './month.service';

describe('MonthController', () => {
  let controller: MonthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonthController],
      providers: [MonthService],
    }).compile();

    controller = module.get<MonthController>(MonthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
