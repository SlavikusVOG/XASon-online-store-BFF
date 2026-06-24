import { Injectable } from '@nestjs/common';
import {
  Client,
  ClientBuilder,
  type AuthMiddlewareOptions,
} from '@commercetools/ts-client';
import {
  ByProjectKeyRequestBuilder,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import { ApiClientsCommercetoolsConfigService } from '../config/api-clients-commercetools-config.service';

@Injectable()
export class ClientCredentialsService {
  constructor(private readonly config: ApiClientsCommercetoolsConfigService) {}

  createClient(): Client {
    const authOptions: AuthMiddlewareOptions = {
      ...this.config.getAuthMiddlewareOptions(),
    };

    return new ClientBuilder()
      .withProjectKey(this.config.projectKey)
      .withClientCredentialsFlow(authOptions)
      .withHttpMiddleware(this.config.getHttpMiddlewareOptions())
      .withLoggerMiddleware()
      .build();
  }

  createApiRoot(): ByProjectKeyRequestBuilder {
    return createApiBuilderFromCtpClient(this.createClient()).withProjectKey({
      projectKey: this.config.projectKey,
    });
  }
}
