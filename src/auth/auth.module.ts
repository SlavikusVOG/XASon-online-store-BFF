import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CommercetoolsConfigService } from '../commercetools/config/commercetools-config.service';
import { ApiClientsCommercetoolsConfigService } from '../commercetools/config/api-clients-commercetools-config.service';
import { ClientCredentialsService } from '../commercetools/client-credentials/client-credentials.service';
import { B2CConfigService } from 'src/commercetools/config/b2c-commercetools-config.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    CommercetoolsConfigService,
    ApiClientsCommercetoolsConfigService,
    ClientCredentialsService,
    B2CConfigService,
  ],
})
export class AuthModule {}
