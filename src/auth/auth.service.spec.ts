import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CommercetoolsConfigService } from '../commercetools/config/commercetools-config.service';

type FetchCall = [input: RequestInfo | URL, init?: RequestInit];

describe('AuthService', () => {
  let service: AuthService;
  const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;

  const config = {
    projectKey: 'test-project',
    authHost: 'https://auth.example.com',
    customerScopes: ['manage_my_orders', 'manage_my_profile'],
    credentials: {
      clientId: 'client-id',
      clientSecret: 'client-secret',
    },
  };

  const tokenResponse = {
    access_token: 'access-token',
    token_type: 'Bearer',
    expires_in: 3600,
    scope: 'manage_my_orders',
    refresh_token: 'refresh-token',
  };

  const getLastFetchCall = (): FetchCall => {
    const lastCall = fetchMock.mock.calls.at(-1);
    if (!lastCall) {
      throw new Error('fetch was not called');
    }
    return lastCall;
  };

  const getFetchHeaders = (init: RequestInit): Record<string, string> =>
    init.headers as Record<string, string>;

  beforeEach(async () => {
    jest.clearAllMocks();
    global.fetch = fetchMock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: CommercetoolsConfigService, useValue: config },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  const mockJsonResponse = (status: number, body?: unknown) => ({
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(body),
    text: jest.fn().mockResolvedValue(JSON.stringify(body)),
  });

  it('creates an anonymous session', async () => {
    fetchMock.mockResolvedValue(
      mockJsonResponse(200, tokenResponse) as unknown as Response,
    );

    const result = await service.createAnonymousSession('anon-1');

    expect(result).toEqual(tokenResponse);

    const [url, init] = getLastFetchCall();
    const headers = getFetchHeaders(init ?? {});

    expect(url).toBe(
      'https://auth.example.com/oauth/test-project/anonymous/token',
    );
    expect(init?.method).toBe('POST');
    expect(headers.Authorization).toMatch(/^Basic /);
    expect(headers['Content-Type']).toBe('application/x-www-form-urlencoded');
    expect(init?.body).toContain('anonymous_id=anon-1');
  });

  it('logs in a customer with store key', async () => {
    fetchMock.mockResolvedValue(
      mockJsonResponse(200, tokenResponse) as unknown as Response,
    );

    await service.login('user@example.com', 'secret', 'my-store');

    const [url, init] = getLastFetchCall();

    expect(url).toBe(
      'https://auth.example.com/oauth/test-project/in-store/key=my-store/customers/token',
    );
    expect(init?.body).toContain('grant_type=password');
  });

  it('refreshes a token', async () => {
    fetchMock.mockResolvedValue(
      mockJsonResponse(200, tokenResponse) as unknown as Response,
    );

    await service.refresh('refresh-token');

    const [url, init] = getLastFetchCall();

    expect(url).toBe('https://auth.example.com/oauth/token');
    expect(init?.body).toContain('refresh_token=refresh-token');
  });

  it('revokes a token', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200 } as Response);

    await service.revoke('access-token', 'access_token');

    const [url, init] = getLastFetchCall();

    expect(url).toBe('https://auth.example.com/oauth/token/revoke');
    expect(init?.body).toContain('token_type_hint=access_token');
  });

  it('introspects a token', async () => {
    const introspection = { active: true };
    fetchMock.mockResolvedValue(
      mockJsonResponse(200, introspection) as unknown as Response,
    );

    const result = await service.introspect('access-token');

    expect(result).toEqual(introspection);

    const [url, init] = getLastFetchCall();

    expect(url).toBe('https://auth.example.com/oauth/introspect');
    expect(init?.body).toContain('token=access-token');
  });

  it('throws UnauthorizedException on 401', async () => {
    fetchMock.mockResolvedValue(
      mockJsonResponse(401, { error: 'invalid' }) as unknown as Response,
    );

    await expect(service.login('user@example.com', 'wrong')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws BadRequestException on 400', async () => {
    fetchMock.mockResolvedValue(
      mockJsonResponse(400, { error: 'bad request' }) as unknown as Response,
    );

    await expect(service.refresh('bad-token')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws InternalServerErrorException on 500', async () => {
    fetchMock.mockResolvedValue(
      mockJsonResponse(500, { error: 'server error' }) as unknown as Response,
    );

    await expect(service.createAnonymousSession()).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
