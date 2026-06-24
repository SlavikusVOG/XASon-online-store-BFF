import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CommercetoolsConfigService } from '../commercetools/config/commercetools-config.service';

describe('AuthService', () => {
  let service: AuthService;
  const fetchMock = jest.fn();

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
    fetchMock.mockResolvedValue(mockJsonResponse(200, tokenResponse));

    const result = await service.createAnonymousSession('anon-1');

    expect(result).toEqual(tokenResponse);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://auth.example.com/oauth/test-project/anonymous/token',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: expect.stringMatching(/^Basic /),
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
        body: expect.stringContaining('anonymous_id=anon-1'),
      }),
    );
  });

  it('logs in a customer with store key', async () => {
    fetchMock.mockResolvedValue(mockJsonResponse(200, tokenResponse));

    await service.login('user@example.com', 'secret', 'my-store');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://auth.example.com/oauth/test-project/in-store/key=my-store/customers/token',
      expect.objectContaining({
        body: expect.stringContaining('grant_type=password'),
      }),
    );
  });

  it('refreshes a token', async () => {
    fetchMock.mockResolvedValue(mockJsonResponse(200, tokenResponse));

    await service.refresh('refresh-token');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://auth.example.com/oauth/token',
      expect.objectContaining({
        body: expect.stringContaining('refresh_token=refresh-token'),
      }),
    );
  });

  it('revokes a token', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200 });

    await service.revoke('access-token', 'access_token');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://auth.example.com/oauth/token/revoke',
      expect.objectContaining({
        body: expect.stringContaining('token_type_hint=access_token'),
      }),
    );
  });

  it('introspects a token', async () => {
    const introspection = { active: true };
    fetchMock.mockResolvedValue(mockJsonResponse(200, introspection));

    const result = await service.introspect('access-token');

    expect(result).toEqual(introspection);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://auth.example.com/oauth/introspect',
      expect.objectContaining({
        body: expect.stringContaining('token=access-token'),
      }),
    );
  });

  it('throws UnauthorizedException on 401', async () => {
    fetchMock.mockResolvedValue(mockJsonResponse(401, { error: 'invalid' }));

    await expect(service.login('user@example.com', 'wrong')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws BadRequestException on 400', async () => {
    fetchMock.mockResolvedValue(mockJsonResponse(400, { error: 'bad request' }));

    await expect(service.refresh('bad-token')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws InternalServerErrorException on 500', async () => {
    fetchMock.mockResolvedValue(mockJsonResponse(500, { error: 'server error' }));

    await expect(
      service.createAnonymousSession(),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
