import { Injectable } from '@nestjs/common';
import { Client, ClientBuilder } from '@commercetools/ts-client';
import {
  ByProjectKeyRequestBuilder,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import { CommercetoolsConfigService } from '../config/commercetools-config.service';
import { AnonymousAuthMiddlewareOptions } from '../types/anonymous-auth-options.type';

@Injectable()
export class AnonymousSessionService {
  constructor(private readonly config: CommercetoolsConfigService) {}

  createClient(anonymousId: string): Client {
    const authOptions: AnonymousAuthMiddlewareOptions = {
      host: this.config.authHost,
      projectKey: this.config.projectKey,
      credentials: {
        ...this.config.credentials,
        anonymousId,
      },
      scopes: this.config.customerScopes,
      httpClient: fetch,
    };

    return new ClientBuilder()
      .withProjectKey(this.config.projectKey)
      .withAnonymousSessionFlow(authOptions)
      .withHttpMiddleware(this.config.getHttpMiddlewareOptions())
      .withLoggerMiddleware()
      .build();
  }

  createApiRoot(anonymousId: string): ByProjectKeyRequestBuilder {
    return createApiBuilderFromCtpClient(
      this.createClient(anonymousId),
    ).withProjectKey({ projectKey: this.config.projectKey });
  }
}
