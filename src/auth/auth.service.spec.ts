import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';
import { mockJwtHelperService, mockJwtTokens, mockUser, mockUsersService } from '../../test/mocks';

describe('AuthService', () => {
  let moduleRef: TestingModule;
  let authService: AuthService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
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

    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('signUp()', () => {
    it('should be success', async () => {
      const result = await authService.signUp(mockUser);

      expect(result).toEqual(mockJwtTokens);
    });

    it('should throw an error (any)', async () => {
      mockUsersService.create = jest.fn().mockRejectedValueOnce(new Error('error'));

      const invokeFn = async () => await authService.signUp(mockUser);

      expect(invokeFn).rejects.toThrowError(Error);
    });

    it('should throw an error (credentials)', async () => {
      mockUsersService.create = jest.fn().mockRejectedValueOnce(new Error('error E11000'));

      const invokeFn = async () => await authService.signUp(mockUser);

      expect(invokeFn).rejects.toThrowError(BadRequestException);
    });
  });

  describe('signIn()', () => {
    it('should be success', async () => {
      const result = await authService.signIn(mockUser);

      expect(result).toEqual(mockJwtTokens);
    });

    it('should throw an error (incorrect password)', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);

      const invokeFn = async () =>
        await authService.signIn({
          username: '123',
          password: '123',
        });

      expect(invokeFn).rejects.toThrowError(BadRequestException);
    });

    it('should throw an error (404 user)', async () => {
      mockUsersService.findOne = jest.fn().mockImplementationOnce(() => undefined);

      const invokeFn = async () =>
        await authService.signIn({
          username: '123',
          password: '123',
        });

      expect(invokeFn).rejects.toThrowError(BadRequestException);
    });
  });
});
