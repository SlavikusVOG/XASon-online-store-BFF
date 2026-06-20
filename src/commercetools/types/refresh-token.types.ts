import { TokenCache } from '@commercetools/ts-client';
import { Credentials } from './credentials.type';

export type RefreshAuthMiddlewareOptions = {
  host: string;
  projectKey: string;
  credentials: Credentials;
  refreshToken: string;
  scopes?: Array<string>;
  tokenCache?: TokenCache;
  oauthUri?: string;
  httpClient: (request: Request) => Promise<Response>;
  httpClientOptions?: object;
};
