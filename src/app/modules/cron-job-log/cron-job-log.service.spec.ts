import { Test, TestingModule } from '@nestjs/testing';
import { CronJobLogService } from './cron-job-log.service';

describe('CronJobLogService', () => {
  let service: CronJobLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CronJobLogService],
    }).compile();

    service = module.get<CronJobLogService>(CronJobLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
