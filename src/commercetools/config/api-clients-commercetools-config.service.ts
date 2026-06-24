import { Injectable } from '@nestjs/common';
import type { HttpMiddlewareOptions } from '@commercetools/ts-client';
import type { AuthMiddlewareOptions } from '../types/auth-options.type';
import { parseScopes } from '../utils/parse-scopes.util';

@Injectable()
export class ApiClientsCommercetoolsConfigService {
  readonly projectKey = process.env.API_CLIENTS_CTP_PROJECT_KEY ?? '';

  readonly credentials = {
    clientId: process.env.API_CLIENTS_CTP_CLIENT_ID ?? '',
    clientSecret: process.env.API_CLIENTS_CTP_CLIENT_SECRET ?? '',
  };

  readonly authHost = process.env.API_CLIENTS_CTP_AUTH_URL ?? '';

  readonly apiHost = process.env.API_CLIENTS_CTP_API_URL ?? '';

  readonly scopes = parseScopes(process.env.API_CLIENTS_CTP_SCOPES);

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
