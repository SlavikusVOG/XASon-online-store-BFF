import { TokenCache } from '@commercetools/ts-client';
import { Credentials } from './credentials.type';

export type AnonymousAuthMiddlewareOptions = {
  host: string;
  projectKey: string;
  credentials: Credentials;
  scopes?: Array<string>;
  oauthUri?: string;
  httpClient: (request: Request) => Promise<Response>;
  httpClientOptions?: object;
  tokenCache?: TokenCache;
};
