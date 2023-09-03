import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './schemas';
import { mockUser, mockUsersModel } from '../../test/mocks';

describe('UsersService', () => {
  let moduleRef: TestingModule;
  let service: UsersService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })],
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUsersModel,
        },
      ],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    moduleRef.close();
  });

  describe('create()', () => {
    it('should create a user', async () => {
      const user = await service.create(mockUser);

      expect(user).toEqual(mockUser);
    });
  });

  describe('findOne()', () => {
    it('should find a user', async () => {
      const user = await service.findOne({});

      expect(user).toEqual(mockUser);
    });
  });
});
