import { Injectable } from '@nestjs/common';
import type { HttpMiddlewareOptions } from '@commercetools/ts-client';
import type { AuthMiddlewareOptions } from '../types/auth-options.type';
import { parseScopes } from '../utils/parse-scopes.util';

@Injectable()
export class CommercetoolsConfigService {
  readonly projectKey = process.env.SPA_CTP_PROJECT_KEY ?? '';

  readonly credentials = {
    clientId: process.env.SPA_CTP_CLIENT_ID ?? '',
    clientSecret: process.env.SPA_CTP_CLIENT_SECRET ?? '',
  };

  readonly authHost = process.env.SPA_CTP_AUTH_URL ?? '';

  readonly apiHost = process.env.SPA_CTP_API_URL ?? '';

  readonly customerScopes = parseScopes(process.env.SPA_CTP_SCOPES);

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
      scopes: this.customerScopes,
      httpClient: fetch,
    };
  }
}
