import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CommercetoolsTokenResponse } from './types/commercetools-token-response.type';

describe('AuthController', () => {
  let app: INestApplication<App>;

  const authService = {
    createAnonymousSession: jest.fn(),
    login: jest.fn(),
    signup: jest.fn(),
    refresh: jest.fn(),
    revoke: jest.fn(),
    introspect: jest.fn(),
  };

  const tokenResponse: CommercetoolsTokenResponse = {
    access_token: 'access-token',
    token_type: 'Bearer',
    expires_in: 3600,
    scope: 'manage_my_orders',
    refresh_token: 'refresh-token',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /auth/anonymous', () => {
    it('creates an anonymous session without anonymousId', async () => {
      authService.createAnonymousSession.mockResolvedValue(tokenResponse);

      const response = await request(app.getHttpServer())
        .post('/auth/anonymous')
        .send({})
        .expect(201);

      expect(authService.createAnonymousSession).toHaveBeenCalledWith(
        undefined,
      );
      expect(response.body).toEqual(tokenResponse);
    });

    it('creates an anonymous session with anonymousId', async () => {
      authService.createAnonymousSession.mockResolvedValue(tokenResponse);

      await request(app.getHttpServer())
        .post('/auth/anonymous')
        .send({ anonymousId: 'anon-123' })
        .expect(201);

      expect(authService.createAnonymousSession).toHaveBeenCalledWith(
        'anon-123',
      );
    });
  });

  describe('POST /auth/login', () => {
    it('logs in a customer', async () => {
      authService.login.mockResolvedValue(tokenResponse);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'user@example.com',
          password: 'secret',
          storeKey: 'my-store',
        })
        .expect(201);

      expect(authService.login).toHaveBeenCalledWith(
        'user@example.com',
        'secret',
        'my-store',
      );
      expect(response.body).toEqual(tokenResponse);
    });
  });

  describe('POST /auth/signup', () => {
    it('signs up a customer', async () => {
      const signupResponse = {
        ...tokenResponse,
        customer: {
          id: 'customer-id',
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      };
      authService.signup.mockResolvedValue(signupResponse);

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'user@example.com',
          password: 'secret',
          firstName: 'John',
          lastName: 'Doe',
          storeKey: 'my-store',
          anonymousId: 'anon-123',
        })
        .expect(201);

      expect(authService.signup).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'secret',
        firstName: 'John',
        lastName: 'Doe',
        storeKey: 'my-store',
        anonymousId: 'anon-123',
      });
      expect(response.body).toEqual(signupResponse);
    });
  });

  describe('POST /auth/refresh', () => {
    it('refreshes an access token', async () => {
      authService.refresh.mockResolvedValue(tokenResponse);

      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'refresh-token' })
        .expect(201);

      expect(authService.refresh).toHaveBeenCalledWith('refresh-token');
      expect(response.body).toEqual(tokenResponse);
    });
  });

  describe('POST /auth/logout', () => {
    it('revokes a token', async () => {
      authService.revoke.mockResolvedValue(undefined);

      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .send({ token: 'access-token', tokenTypeHint: 'access_token' })
        .expect(201);

      expect(authService.revoke).toHaveBeenCalledWith(
        'access-token',
        'access_token',
      );
      expect(response.body).toEqual({ success: true });
    });
  });

  describe('POST /auth/introspect', () => {
    it('introspects a token', async () => {
      const introspection = { active: true, scope: 'manage_my_orders' };
      authService.introspect.mockResolvedValue(introspection);

      const response = await request(app.getHttpServer())
        .post('/auth/introspect')
        .send({ token: 'access-token' })
        .expect(201);

      expect(authService.introspect).toHaveBeenCalledWith('access-token');
      expect(response.body).toEqual(introspection);
    });
  });
});
