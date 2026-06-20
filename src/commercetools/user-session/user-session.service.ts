import { Injectable } from '@nestjs/common';
import { Client, ClientBuilder } from '@commercetools/ts-client';
import {
  ByProjectKeyRequestBuilder,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import { CommercetoolsConfigService } from '../config/commercetools-config.service';
import { PasswordAuthMiddlewareOptions } from '../types/password-options.type';

@Injectable()
export class UserSessionService {
  constructor(private readonly config: CommercetoolsConfigService) {}

  createClient(username: string, password: string): Client {
    const authOptions: PasswordAuthMiddlewareOptions = {
      host: this.config.authHost,
      projectKey: this.config.projectKey,
      credentials: {
        ...this.config.credentials,
        user: {
          username,
          password,
        },
      },
      scopes: this.config.scopes,
      httpClient: fetch,
    };

    return new ClientBuilder()
      .withProjectKey(this.config.projectKey)
      .withPasswordFlow(authOptions)
      .withHttpMiddleware(this.config.getHttpMiddlewareOptions())
      .withLoggerMiddleware()
      .build();
  }

  createApiRoot(
    username: string,
    password: string,
  ): ByProjectKeyRequestBuilder {
    return createApiBuilderFromCtpClient(
      this.createClient(username, password),
    ).withProjectKey({ projectKey: this.config.projectKey });
  }
}
