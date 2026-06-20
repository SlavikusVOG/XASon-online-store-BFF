import { Test, TestingModule } from '@nestjs/testing';
import { UserSessionService } from './user-session.service';
import { CommercetoolsConfigService } from '../config/commercetools-config.service';

describe('UserSessionService', () => {
  let service: UserSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSessionService, CommercetoolsConfigService],
    }).compile();

    service = module.get<UserSessionService>(UserSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
