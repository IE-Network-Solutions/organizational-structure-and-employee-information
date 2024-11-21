import { Test, TestingModule } from '@nestjs/testing';
import { CronJobLogController } from './cron-job-log.controller';
import { CronJobLogService } from './cron-job-log.service';

describe('CronJobLogController', () => {
  let controller: CronJobLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CronJobLogController],
      providers: [CronJobLogService],
    }).compile();

    controller = module.get<CronJobLogController>(CronJobLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
