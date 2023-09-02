import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';
import { mockJwtHelperService, mockJwtTokens, mockUser, mockUsersService } from '../../test/mocks';

describe('AuthController', () => {
  let moduleRef: TestingModule;
  let authController: AuthController;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtHelperService,
          useValue: mockJwtHelperService,
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('signUp()', () => {
    it('should be success', async () => {
      const result = await authController.signUp(mockUser);

      expect(result).toEqual(mockJwtTokens);
    });
  });

  describe('signIn()', () => {
    it('should be success', async () => {
      const result = await authController.signIn(mockUser);

      expect(result).toEqual(mockJwtTokens);
    });
  });
});
