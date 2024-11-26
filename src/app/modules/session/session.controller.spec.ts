import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { sessionMock } from './tests/test.data';

jest.mock('./session.service');

describe('SessionController', () => {
  let sessionController: SessionController;
  let sessionService: SessionService;

  // Mock data
  // const mockSessionData: Session = {monthMock()};

  const mockPaginationOptions: PaginationDto = {
    page: 1,
    limit: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [
        {
          provide: SessionService,
          useValue: {
            createSession: jest.fn().mockResolvedValue(sessionMock),
            findAllSessions: jest.fn().mockResolvedValue([sessionMock]),
            findOneSession: jest.fn().mockResolvedValue(sessionMock),
            updateSession: jest.fn().mockResolvedValue(sessionMock),
            removeSession: jest.fn().mockResolvedValue(sessionMock),
          },
        },
      ],
    }).compile();

    sessionController = module.get<SessionController>(SessionController);
    sessionService = module.get<SessionService>(SessionService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when createSession is called', () => {
      let session: Session;

      beforeEach(async () => {
        const createSessionDto: CreateSessionDto = {createSessionData()};
        session = await sessionController.createSession(createSessionDto, 'tenant-id');
      });

      test('then it should call sessionService.createSession', () => {
        expect(sessionService.createSession).toHaveBeenCalledWith(
          expect.any(CreateSessionDto),
          'tenant-id',
        );
      });

      test('then it should return a session', () => {
        expect(session).toEqual(sessionMock);
      });
    });
  });

  describe('findOne', () => {
    describe('when findOneSession is called', () => {
      let session: Session;

      beforeEach(async () => {
        session = await sessionController.findOneSession('1');
      });

      test('then it should call sessionService.findOneSession', () => {
        expect(sessionService.findOneSession).toHaveBeenCalledWith('1');
      });

      test('then it should return the session', () => {
        expect(session).toEqual(sessionMock);
      });
    });
  });

  describe('findAll', () => {
    describe('when findAllSessions is called', () => {
      beforeEach(async () => {
        await sessionController.findAllSessions('tenant-id', mockPaginationOptions);
      });

      test('then it should call sessionService.findAllSessions', () => {
        expect(sessionService.findAllSessions).toHaveBeenCalledWith(
          'tenant-id',
          mockPaginationOptions,
        );
      });

      test('then it should return all sessions', async () => {
        expect(await sessionController.findAllSessions('tenant-id', mockPaginationOptions)).toEqual([sessionMock]);
      });
    });
  });

  describe('update', () => {
    describe('when updateSession is called', () => {
      let session: Session;

      beforeEach(async () => {
        const updateSessionDto: UpdateSessionDto = {
          name: '2024 Fall Semester',
          description: 'Fall Semester for 2024',
          startDate: new Date('2024-09-01T00:00:00Z'),
          endDate: new Date('2024-12-31T23:59:59Z'),
        };
        session = await sessionController.updateSession('tenant-id', '1', updateSessionDto);
      });

      test('then it should call sessionService.updateSession', () => {
        expect(sessionService.updateSession).toHaveBeenCalledWith(
          '1',
          expect.any(UpdateSessionDto),
          'tenant-id',
        );
      });

      test('then it should return the updated session', () => {
        expect(session).toEqual(sessionMock);
      });
    });
  });

  describe('remove', () => {
    describe('when removeSession is called', () => {
      beforeEach(async () => {
        await sessionController.removeSession('tenant-id', '1');
      });

      test('then it should call sessionService.removeSession', () => {
        expect(sessionService.removeSession).toHaveBeenCalledWith('1');
      });

      test('then it should return a session', async () => {
        expect(await sessionController.removeSession('tenant-id', '1')).toEqual(sessionMock);
      });
    });
  });
});
