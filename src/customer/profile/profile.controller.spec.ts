import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

describe('ProfileController', () => {
  let app: INestApplication<App>;

  const profileService = {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
  };

  const authorization = 'Bearer access-token';
  const profile = { id: 'customer-id', email: 'user@example.com', version: 1 };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [{ provide: ProfileService, useValue: profileService }],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /me', () => {
    it('returns 401 without authorization header', () => {
      return request(app.getHttpServer()).get('/me').expect(401);
    });

    it('returns 401 with invalid authorization header', () => {
      return request(app.getHttpServer())
        .get('/me')
        .set('Authorization', 'access-token')
        .expect(401);
    });

    it('returns customer profile', async () => {
      profileService.getProfile.mockResolvedValue(profile);

      const response = await request(app.getHttpServer())
        .get('/me')
        .set('Authorization', authorization)
        .expect(200);

      expect(profileService.getProfile).toHaveBeenCalledWith(authorization);
      expect(response.body).toEqual(profile);
    });
  });

  describe('POST /me', () => {
    it('updates customer profile', async () => {
      const update = {
        version: 1,
        actions: [{ action: 'setFirstName', firstName: 'Jane' }],
      };
      const updatedProfile = { ...profile, firstName: 'Jane' };
      profileService.updateProfile.mockResolvedValue(updatedProfile);

      const response = await request(app.getHttpServer())
        .post('/me')
        .set('Authorization', authorization)
        .send(update)
        .expect(201);

      expect(profileService.updateProfile).toHaveBeenCalledWith(
        authorization,
        update,
      );
      expect(response.body).toEqual(updatedProfile);
    });
  });
});
