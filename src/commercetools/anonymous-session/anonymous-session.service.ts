import { TokenCache } from '@commercetools/ts-client';
import { Injectable } from '@nestjs/common';

type AnonymousAuthMiddlewareOptions = {
  host: string;
  projectKey: string;
  credentials: {
    clientId: string;
    clientSecret: string;
    anonymousId?: string;
  };
  scopes?: Array<string>;
  oauthUri?: string;
  httpClient: Function;
  httpClientOptions?: object;
  tokenCache?: TokenCache;
};

@Injectable()
export class AnonymousSessionService {
  private readonly options: AnonymousAuthMiddlewareOptions;

  constructor(
    projectKey: string,
    clientId: string,
    clientSecret: string,
    anonymousId: string,
    host: string,
    scopes: string[],
  ) {
    this.options = {
      host: 'https://auth.europe-west1.gcp.commercetools.com',
      projectKey,
      credentials: {
        clientId: process.env.CTP_CLIENT_ID ?? '',
        clientSecret: process.env.CTP_CLIENT_SECRET ?? '',
        anonymousId: process.env.CTP_ANONYMOUS_ID ?? '', // a unique id
      },
      scopes: [`manage_project:${projectKey}`],
      httpClient: fetch,
    };
  }
}
