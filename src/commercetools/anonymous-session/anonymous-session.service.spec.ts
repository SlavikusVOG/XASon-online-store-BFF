import { Test, TestingModule } from '@nestjs/testing';
import { AnonymousSessionService } from './anonymous-session.service';
import { CommercetoolsConfigService } from '../config/commercetools-config.service';

describe('AnonymousSessionService', () => {
  let service: AnonymousSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnonymousSessionService, CommercetoolsConfigService],
    }).compile();

    service = module.get<AnonymousSessionService>(AnonymousSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
