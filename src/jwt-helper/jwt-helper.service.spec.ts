import { Test, TestingModule } from '@nestjs/testing';
import { JwtHelperService } from './jwt-helper.service';

describe('JwtService', () => {
  let service: JwtHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtHelperService],
    }).compile();

    service = module.get<JwtHelperService>(JwtHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
