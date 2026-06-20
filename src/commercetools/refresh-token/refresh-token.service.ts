import { Injectable } from '@nestjs/common';
import { Client, ClientBuilder } from '@commercetools/ts-client';
import {
  ByProjectKeyRequestBuilder,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import { CommercetoolsConfigService } from '../config/commercetools-config.service';
import { RefreshAuthMiddlewareOptions } from '../types/refresh-token.types';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly config: CommercetoolsConfigService) {}

  createClient(refreshToken: string): Client {
    const authOptions: RefreshAuthMiddlewareOptions = {
      host: this.config.authHost,
      projectKey: this.config.projectKey,
      credentials: this.config.credentials,
      refreshToken,
      scopes: this.config.scopes,
      httpClient: fetch,
    };

    return new ClientBuilder()
      .withProjectKey(this.config.projectKey)
      .withRefreshTokenFlow(authOptions)
      .withHttpMiddleware(this.config.getHttpMiddlewareOptions())
      .withLoggerMiddleware()
      .build();
  }

  createApiRoot(refreshToken: string): ByProjectKeyRequestBuilder {
    return createApiBuilderFromCtpClient(
      this.createClient(refreshToken),
    ).withProjectKey({ projectKey: this.config.projectKey });
  }
}
