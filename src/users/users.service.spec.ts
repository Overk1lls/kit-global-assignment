import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './schemas';
import { mockUser, mockUsersModel } from '../../test/mocks';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })],
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUsersModel,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe('create()', () => {
    it('should create a user', async () => {
      const user = await usersService.create(mockUser);

      expect(user).toEqual(mockUser);
    });
  });

  describe('findOne()', () => {
    it('should find a user', async () => {
      const user = await usersService.findOne({});

      expect(user).toEqual(mockUser);
    });
  });
});
