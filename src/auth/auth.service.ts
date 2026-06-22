import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommercetoolsConfigService } from '../commercetools/config/commercetools-config.service';
import { CommercetoolsTokenResponse } from './types/commercetools-token-response.type';
import { CommercetoolsIntrospectionResponse } from './types/commercetools-introspection-response.type';

@Injectable()
export class AuthService {
  constructor(private readonly config: CommercetoolsConfigService) {}

  async createAnonymousSession(
    anonymousId?: string,
  ): Promise<CommercetoolsTokenResponse> {
    const body: Record<string, string> = {
      grant_type: 'client_credentials',
      scope: this.config.customerScopes.join(' '),
    };

    if (anonymousId) {
      body.anonymous_id = anonymousId;
    }

    return this.postForm<CommercetoolsTokenResponse>(
      `${this.config.authHost}/oauth/${this.config.projectKey}/anonymous/token`,
      body,
    );
  }

  async login(
    email: string,
    password: string,
    storeKey?: string,
  ): Promise<CommercetoolsTokenResponse> {
    const storePath = storeKey
      ? `/in-store/key=${encodeURIComponent(storeKey)}`
      : '';

    return this.postForm<CommercetoolsTokenResponse>(
      `${this.config.authHost}/oauth/${this.config.projectKey}${storePath}/customers/token`,
      {
        grant_type: 'password',
        username: email,
        password,
        scope: this.config.customerScopes.join(' '),
      },
    );
  }

  refresh(refreshToken: string): Promise<CommercetoolsTokenResponse> {
    return this.postForm<CommercetoolsTokenResponse>(
      `${this.config.authHost}/oauth/token`,
      {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
    );
  }

  async revoke(
    token: string,
    tokenTypeHint?: 'access_token' | 'refresh_token',
  ): Promise<void> {
    const body: Record<string, string> = { token };

    if (tokenTypeHint) {
      body.token_type_hint = tokenTypeHint;
    }

    await this.postFormNoContent(
      `${this.config.authHost}/oauth/token/revoke`,
      body,
    );
  }

  introspect(token: string): Promise<CommercetoolsIntrospectionResponse> {
    return this.postForm<CommercetoolsIntrospectionResponse>(
      `${this.config.authHost}/oauth/introspect`,
      { token },
    );
  }

  private get basicAuthHeader(): string {
    const credentials = `${this.config.credentials.clientId}:${this.config.credentials.clientSecret}`;
    const encoded = Buffer.from(credentials).toString('base64');
    return `Basic ${encoded}`;
  }

  private async postForm<T>(
    url: string,
    body: Record<string, string>,
  ): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: this.basicAuthHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(body).toString(),
    });

    if (!response.ok) {
      throw await this.toHttpException(response);
    }

    return response.json() as Promise<T>;
  }

  private async postFormNoContent(
    url: string,
    body: Record<string, string>,
  ): Promise<void> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: this.basicAuthHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(body).toString(),
    });

    if (!response.ok) {
      throw await this.toHttpException(response);
    }
  }

  private async toHttpException(response: Response) {
    const responseText = await response.text();
    const details =
      responseText || 'commercetools authorization request failed';

    if (response.status === 400) {
      return new BadRequestException(details);
    }

    if (response.status === 401 || response.status === 403) {
      return new UnauthorizedException(details);
    }

    return new InternalServerErrorException(details);
  }
}
