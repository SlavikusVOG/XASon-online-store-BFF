import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommercetoolsService } from './commercetools/commercetools.service';
import { CommercetoolsConfigService } from './commercetools/config/commercetools-config.service';
import { ClientCredentialsService } from './commercetools/client-credentials/client-credentials.service';
import { AnonymousSessionService } from './commercetools/anonymous-session/anonymous-session.service';
import { UserSessionService } from './commercetools/user-session/user-session.service';
import { RefreshTokenService } from './commercetools/refresh-token/refresh-token.service';
import { ApiClientsService } from './commercetools/api-clients/api-clients.service';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [AuthModule, CustomerModule],
  controllers: [AppController],
  providers: [
    AppService,
    CommercetoolsConfigService,
    CommercetoolsService,
    ClientCredentialsService,
    AnonymousSessionService,
    UserSessionService,
    RefreshTokenService,
    ApiClientsService,
  ],
})
export class AppModule {}
