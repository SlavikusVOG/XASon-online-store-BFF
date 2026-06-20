import { Test, TestingModule } from '@nestjs/testing';
import { ClientCredentialsService } from './client-credentials.service';
import { CommercetoolsConfigService } from '../config/commercetools-config.service';

describe('ClientCredentialsService', () => {
  let service: ClientCredentialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientCredentialsService, CommercetoolsConfigService],
    }).compile();

    service = module.get<ClientCredentialsService>(ClientCredentialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
