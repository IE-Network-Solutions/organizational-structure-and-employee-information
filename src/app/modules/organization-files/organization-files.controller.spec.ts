import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationFilesController } from './organization-files.controller';
import { OrganizationFilesService } from './organization-files.service';

describe('OrganizationFilesController', () => {
  let controller: OrganizationFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationFilesController],
      providers: [OrganizationFilesService],
    }).compile();

    controller = module.get<OrganizationFilesController>(
      OrganizationFilesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
