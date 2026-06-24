import { TokenCache } from '@commercetools/ts-client';

export type PasswordAuthMiddlewareOptions = {
  host: string;
  projectKey: string;
  credentials: {
    clientId: string;
    clientSecret: string;
    user: {
      username: string;
      password: string;
    };
  };
  scopes?: Array<string>;
  tokenCache?: TokenCache;
  oauthUri?: string;
  httpClient: (request: Request) => Promise<Response>;
  httpClientOptions?: object;
};
