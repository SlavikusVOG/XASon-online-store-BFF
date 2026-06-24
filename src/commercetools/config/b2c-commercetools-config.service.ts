import { Injectable } from '@nestjs/common';
import {
  ClientBuilder,
  type Client,
  type HttpMiddlewareOptions,
} from '@commercetools/ts-client';
import type { AuthMiddlewareOptions } from '../types/auth-options.type';
import { parseScopes } from '../utils/parse-scopes.util';
import {
  ByProjectKeyRequestBuilder,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';

@Injectable()
export class B2CConfigService {
  createApiRoot(): ByProjectKeyRequestBuilder {
    return createApiBuilderFromCtpClient(this.createClient()).withProjectKey({
      projectKey: this.projectKey,
    });
  }

  createClient(): Client {
    return new ClientBuilder()
      .withProjectKey(this.projectKey)
      .withClientCredentialsFlow(this.getAuthMiddlewareOptions())
      .withHttpMiddleware(this.getHttpMiddlewareOptions())
      .build();
  }

  readonly projectKey = process.env.CTP_PROJECT_KEY ?? '';

  readonly credentials = {
    clientId: process.env.CTP_CLIENT_ID ?? '',
    clientSecret: process.env.CTP_CLIENT_SECRET ?? '',
  };

  readonly authHost = process.env.CTP_AUTH_URL ?? '';

  readonly apiHost = process.env.CTP_API_URL ?? '';

  readonly scopes = parseScopes(process.env.CTP_SCOPES);

  getHttpMiddlewareOptions(): HttpMiddlewareOptions {
    return {
      host: this.apiHost,
      httpClient: fetch,
    };
  }

  getAuthMiddlewareOptions(): AuthMiddlewareOptions {
    return {
      host: this.authHost,
      projectKey: this.projectKey,
      credentials: this.credentials,
      scopes: this.scopes,
      httpClient: fetch,
    };
  }
}
