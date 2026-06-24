import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { ShoppingListsController } from './shopping-lists.controller';
import { ShoppingListsService } from './shopping-lists.service';

describe('ShoppingListsController', () => {
  let app: INestApplication<App>;

  const shoppingListsService = {
    getShoppingLists: jest.fn(),
    getShoppingListById: jest.fn(),
    createShoppingList: jest.fn(),
    updateShoppingList: jest.fn(),
  };

  const authorization = 'Bearer access-token';

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingListsController],
      providers: [
        { provide: ShoppingListsService, useValue: shoppingListsService },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /me/shopping-lists', () => {
    it('returns 401 without authorization header', () => {
      return request(app.getHttpServer()).get('/me/shopping-lists').expect(401);
    });

    it('returns shopping lists', async () => {
      const shoppingLists = { results: [{ id: 'list-1' }], total: 1 };
      shoppingListsService.getShoppingLists.mockResolvedValue(shoppingLists);

      const response = await request(app.getHttpServer())
        .get('/me/shopping-lists')
        .set('Authorization', authorization)
        .expect(200);

      expect(shoppingListsService.getShoppingLists).toHaveBeenCalledWith(
        authorization,
        expect.any(Object),
      );
      expect(response.body).toEqual(shoppingLists);
    });
  });

  describe('GET /me/shopping-lists/:id', () => {
    it('returns a shopping list by id', async () => {
      const shoppingList = { id: 'list-1', name: { en: 'Wishlist' } };
      shoppingListsService.getShoppingListById.mockResolvedValue(shoppingList);

      const response = await request(app.getHttpServer())
        .get('/me/shopping-lists/list-1')
        .set('Authorization', authorization)
        .expect(200);

      expect(shoppingListsService.getShoppingListById).toHaveBeenCalledWith(
        authorization,
        'list-1',
        expect.any(Object),
      );
      expect(response.body).toEqual(shoppingList);
    });
  });

  describe('POST /me/shopping-lists', () => {
    it('creates a shopping list', async () => {
      const draft = { name: { en: 'Wishlist' } };
      const shoppingList = { id: 'list-1', ...draft };
      shoppingListsService.createShoppingList.mockResolvedValue(shoppingList);

      const response = await request(app.getHttpServer())
        .post('/me/shopping-lists')
        .set('Authorization', authorization)
        .send(draft)
        .expect(201);

      expect(shoppingListsService.createShoppingList).toHaveBeenCalledWith(
        authorization,
        draft,
      );
      expect(response.body).toEqual(shoppingList);
    });
  });

  describe('POST /me/shopping-lists/:id', () => {
    it('updates a shopping list', async () => {
      const update = {
        version: 1,
        actions: [{ action: 'changeName', name: { en: 'Updated' } }],
      };
      const shoppingList = { id: 'list-1', name: { en: 'Updated' } };
      shoppingListsService.updateShoppingList.mockResolvedValue(shoppingList);

      const response = await request(app.getHttpServer())
        .post('/me/shopping-lists/list-1')
        .set('Authorization', authorization)
        .send(update)
        .expect(201);

      expect(shoppingListsService.updateShoppingList).toHaveBeenCalledWith(
        authorization,
        'list-1',
        update,
      );
      expect(response.body).toEqual(shoppingList);
    });
  });
});
