import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';
import { mockJwtHelperService, mockJwtTokens, mockUser, mockUsersService } from '../../test/mocks';

describe('AuthController', () => {
  let moduleRef: TestingModule;
  let controller: AuthController;

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

    controller = moduleRef.get<AuthController>(AuthController);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('signUp()', () => {
    it('should be success', async () => {
      const result = await controller.signUp(mockUser);

      expect(result).toEqual(mockJwtTokens);
    });

    it('should throw an error (any)', async () => {
      mockUsersService.create = jest.fn().mockRejectedValueOnce(new Error('error'));

      const invokeFn = async () => await controller.signUp(mockUser);

      expect(invokeFn).rejects.toThrowError(Error);
    });

    it('should throw an error (credentials)', async () => {
      mockUsersService.create = jest.fn().mockRejectedValueOnce(new Error('error E11000'));

      const invokeFn = async () => await controller.signUp(mockUser);

      expect(invokeFn).rejects.toThrowError(ConflictException);
    });
  });

  describe('signIn()', () => {
    it('should be success', async () => {
      const result = await controller.signIn(mockUser);

      expect(result).toEqual(mockJwtTokens);
    });
  });
});
