import { Credentials } from './credentials.type';
import { TokenCache } from '@commercetools/ts-client';

export type AuthMiddlewareOptions = {
  host: string;
  projectKey: string;
  credentials: Credentials;
  scopes?: Array<string>;
  // For internal usage only
  oauthUri?: string;
  tokenCache?: TokenCache;
  httpClient?: (request: Request) => Promise<Response>;
  httpClientOptions?: object;
};
