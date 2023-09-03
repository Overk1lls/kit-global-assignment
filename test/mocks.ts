import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { Request } from 'express';
import { JwtPayload } from '../src/jwt-helper/interfaces';
import { jwtAudience, jwtIssuer, jwtScopeStrings } from '../src/jwt-helper/jwt-helper.constants';
import { Exercise } from '../src/exercises/schemas';
import { Project } from '../src/projects/schemas';
import { User } from '../src/users/schemas';

export const mockRequest = { user: { scopes: [] } } as Request & { user: JwtPayload };

export const mockJwtTokens = {
  accessToken:
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGVjOTllMTA3NTZhMTVhMmE1ODQxNWYiLCJzY29wZXMiOlsiZXhlcmNpc2VzOmNyZWF0ZSIsImV4ZXJjaXNlczpyZWFkIiwiZXhlcmNpc2VzOnVwZGF0ZSIsImV4ZXJjaXNlczpkZWxldGUiLCJwcm9qZWN0czpjcmVhdGUiLCJwcm9qZWN0czpyZWFkIiwicHJvamVjdHM6dXBkYXRlIiwicHJvamVjdHM6ZGVsZXRlIl0sImlhdCI6MTY5MzUwNDY1MSwiZXhwIjoxNjkzNTkxMDUxLCJhdWQiOiJ1c2VycyIsImlzcyI6IktpdCBHbG9iYWwiLCJqdGkiOiJjNDg2YWMxNi0wOWMyLTQ5ZmYtYjMxNi03ZGM1NTA1MTFkOTIifQ._2P7CVU8rvitrX1EkuWc3cPeHWcutxB3ENGanvhV2jB7y0V2Nz_PRGkkY66L2mJTWWKj2dKMpc9f3NGfsOuw6A',
  refreshToken:
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGVjOTllMTA3NTZhMTVhMmE1ODQxNWYiLCJzY29wZXMiOlsiZXhlcmNpc2VzOmNyZWF0ZSIsImV4ZXJjaXNlczpyZWFkIiwiZXhlcmNpc2VzOnVwZGF0ZSIsImV4ZXJjaXNlczpkZWxldGUiLCJwcm9qZWN0czpjcmVhdGUiLCJwcm9qZWN0czpyZWFkIiwicHJvamVjdHM6dXBkYXRlIiwicHJvamVjdHM6ZGVsZXRlIl0sImlhdCI6MTY5MzUwNDY1MSwiZXhwIjoxNjkzNTkxMDUxLCJhdWQiOiJ1c2VycyIsImlzcyI6IktpdCBHbG9iYWwiLCJqdGkiOiJjNDg2YWMxNi0wOWMyLTQ5ZmYtYjMxNi03ZGM1NTA1MTFkOTIifQ._2P7CVU8rvitrX1EkuWc3cPeHWcutxB3ENGanvhV2jB7y0V2Nz_PRGkkY66L2mJTWWKj2dKMpc9f3NGfsOuw6A',
};

export const mockUser: User & { _id: Types.ObjectId } = {
  _id: new Types.ObjectId('64ecfd0eaa1af30e3bf8995c'),
  email: 'test-user@gmail.com',
  username: 'test-user',
  password: 'test-password',
};

export const mockJwtPayload = {
  aud: jwtAudience,
  iss: jwtIssuer,
  scopes: jwtScopeStrings,
};

export const mockUsersService = {
  create: () => mockUser,
  findOne: () => ({
    ...mockUser,
    password: bcrypt.hashSync(mockUser.password, 10),
  }),
};

export const mockJwtHelperService = {
  assertRequiredScopes: () => true,
  getAccessTokenPayload: () => mockJwtPayload,
  generateUserTokens: () => mockJwtTokens,
};

export const mockObjectIdString = '64ecfd0eaa1af30e3bf8995c';

export const mockObjectId = new Types.ObjectId(mockObjectIdString);

export const mockProject: Project & { _id: Types.ObjectId } = {
  _id: mockObjectId,
  name: 'test-project',
  description: 'test-project',
  exercises: [],
};

export const mockExercise: Exercise & { _id: Types.ObjectId } = {
  _id: mockObjectId,
  name: 'test-exercise',
  description: 'test-exercise',
  status: 'Progress',
  project: mockProject,
};

export const mockExercisesService = {
  create: jest.fn().mockResolvedValue(mockExercise),
  getAll: jest.fn().mockResolvedValue([mockExercise]),
  getOneById: jest.fn().mockResolvedValue(mockExercise),
  updateOneById: jest.fn().mockResolvedValue(mockExercise),
  deleteOneById: jest.fn().mockResolvedValue(mockExercise),
};

export const mockExerciseModel = {
  new: jest.fn().mockImplementation(() => mockExercise),
  constructor: jest.fn().mockImplementation(() => mockExercise),
  create: jest.fn().mockResolvedValue({ toObject: () => mockExercise }),
  find: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([{ toObject: () => mockExercise }]),
  findById: jest.fn().mockResolvedValue({ toObject: () => mockExercise }),
  findByIdAndUpdate: jest.fn().mockResolvedValue({ toObject: () => mockExercise }),
  findByIdAndDelete: jest.fn().mockResolvedValue({ toObject: () => mockExercise }),
  insertMany: jest.fn(),
};

export const mockProjectsService = {
  create: jest.fn().mockResolvedValue(mockProject),
  getAll: jest.fn().mockResolvedValue([mockProject]),
  getOneById: jest.fn().mockResolvedValue(mockProject),
  updateOneById: jest.fn().mockResolvedValue(mockProject),
  deleteOneById: jest.fn().mockResolvedValue(mockProject),
};

export const mockProjectModel = {
  new: jest.fn().mockResolvedValue(mockProject),
  constructor: jest.fn().mockResolvedValue(mockProject),
  create: jest.fn().mockResolvedValue(mockProject),
  find: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([{ toObject: () => mockExercise }]),
  populate: jest.fn().mockResolvedValue({ ...mockProject, exercises: [mockExercise] }),
  findById: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockResolvedValue({ toObject: () => mockProject }),
  findByIdAndDelete: jest.fn().mockResolvedValue({ toObject: () => mockProject }),
};

export const mockUsersModel = {
  new: jest.fn().mockResolvedValue(mockUser),
  constructor: jest.fn().mockResolvedValue(mockUser),
  create: jest.fn().mockResolvedValue({ toObject: () => mockUser }),
  findOne: jest.fn().mockResolvedValue({ toObject: () => mockUser }),
};

export const mockAuthService = {
  signUp: jest.fn(() => mockJwtTokens),
  signIn: jest.fn(() => mockJwtTokens),
};
