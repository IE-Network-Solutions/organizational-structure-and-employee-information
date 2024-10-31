import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationFilesService } from './organization-files.service';

describe('OrganizationFilesService', () => {
  let service: OrganizationFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationFilesService],
    }).compile();

    service = module.get<OrganizationFilesService>(OrganizationFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
