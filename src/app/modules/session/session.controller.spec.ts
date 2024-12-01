import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { Session } from 'inspector';
import {
  createSessionData,
  paginationResultSessionData,
  sessionMock,
} from './tests/test.data';

jest.mock('./session.service.ts');

describe('SessionController', () => {
  let controller: SessionController;
  let service: SessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [SessionService],
    }).compile();

    controller = module.get<SessionController>(SessionController);
    service = module.get<SessionService>(SessionService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createSession', () => {
    describe('when createSession is called', () => {
      let session: Session;
      const createSessionDto = createSessionData();
      const tenantId = 'tenant-1';

      beforeEach(async () => {
        jest.spyOn(service, 'createSession').mockResolvedValue(sessionMock());
        await controller.createSession(createSessionDto, tenantId);
      });

      test('then it should return the created Session', async () => {
        expect(
          await controller.createSession(createSessionDto, tenantId),
        ).toEqual(sessionMock());
      });

      test('then it should call SessionService.createSession with correct parameters', () => {
        expect(service.createSession).toHaveBeenCalledWith(
          createSessionDto,
          tenantId,
        );
      });
    });
  });

  describe('findAllSessions', () => {
    it('should call SessionService.findAllSessions with correct parameters and return paginated data', async () => {
      const paginationOptions = { page: 1, limit: 10 };
      const tenantId = 'some-tenant-id';

      jest
        .spyOn(service, 'findAllSessions')
        .mockResolvedValue(paginationResultSessionData());

      const result = await controller.findAllSessions(
        tenantId,
        paginationOptions,
      );

      expect(result).toEqual(paginationResultSessionData());
      expect(service.findAllSessions).toHaveBeenCalledWith(
        tenantId,
        paginationOptions,
      );
    });
  });

  describe('findOneSession', () => {
    it('should call SessionService.findOneSession with correct id and return a single entity', async () => {
      const id = '1234567890';

      jest.spyOn(service, 'findOneSession').mockResolvedValue(sessionMock());

      const result = await controller.findOneSession(id);

      expect(result).toEqual(sessionMock());
      expect(service.findOneSession).toHaveBeenCalledWith(id);
    });
  });

  describe('updateSession', () => {
    describe('when updateSession is called', () => {
      let session: Session;
      const updateSessionDto = sessionMock();
      const id = '1234567890';
      const tenantId = 'tenant-1';

      beforeEach(async () => {
        jest.spyOn(service, 'updateSession').mockResolvedValue(sessionMock());
        await controller.updateSession(tenantId, id, updateSessionDto);
      });

      test('then it should return the updated Session', async () => {
        expect(
          await controller.updateSession(tenantId, id, updateSessionDto),
        ).toEqual(sessionMock());
      });

      test('then it should call SessionService.updateSession with correct parameters', () => {
        expect(service.updateSession).toHaveBeenCalledWith(
          id,
          updateSessionDto,
          tenantId,
        );
      });
    });
  });

  describe('removeSession', () => {
    it('should call SessionService.removeSession with correct id and return a confirmation message', async () => {
      const id = '1234567890';
      const tenantId = 'tenant-1';

      jest.spyOn(service, 'removeSession').mockResolvedValue(undefined);

      const result = await controller.removeSession(tenantId, id);

      expect(result).toBeUndefined();
      expect(service.removeSession).toHaveBeenCalledWith(id);
    });
  });
});
