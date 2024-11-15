import { Test, TestingModule } from '@nestjs/testing';
import { BranchRequestService } from './branch-request.service';

describe('BranchRequestService', () => {
  let service: BranchRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BranchRequestService],
    }).compile();

    service = module.get<BranchRequestService>(BranchRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
