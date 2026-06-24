import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let app: INestApplication<App>;

  const ordersService = {
    getOrders: jest.fn(),
    getOrderById: jest.fn(),
    createOrderFromCart: jest.fn(),
  };

  const authorization = 'Bearer access-token';

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: ordersService }],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /me/orders', () => {
    it('returns 401 without authorization header', () => {
      return request(app.getHttpServer()).get('/me/orders').expect(401);
    });

    it('returns customer orders', async () => {
      const orders = { results: [{ id: 'order-1' }], total: 1 };
      ordersService.getOrders.mockResolvedValue(orders);

      const response = await request(app.getHttpServer())
        .get('/me/orders')
        .set('Authorization', authorization)
        .expect(200);

      expect(ordersService.getOrders).toHaveBeenCalledWith(
        authorization,
        expect.any(Object),
      );
      expect(response.body).toEqual(orders);
    });
  });

  describe('GET /me/orders/:id', () => {
    it('returns an order by id', async () => {
      const order = { id: 'order-1', orderNumber: '10001' };
      ordersService.getOrderById.mockResolvedValue(order);

      const response = await request(app.getHttpServer())
        .get('/me/orders/order-1')
        .set('Authorization', authorization)
        .expect(200);

      expect(ordersService.getOrderById).toHaveBeenCalledWith(
        authorization,
        'order-1',
        expect.any(Object),
      );
      expect(response.body).toEqual(order);
    });
  });

  describe('POST /me/orders', () => {
    it('creates an order from cart', async () => {
      const draft = { id: 'cart-1', version: 3 };
      const order = { id: 'order-1', orderNumber: '10001' };
      ordersService.createOrderFromCart.mockResolvedValue(order);

      const response = await request(app.getHttpServer())
        .post('/me/orders')
        .set('Authorization', authorization)
        .send(draft)
        .expect(201);

      expect(ordersService.createOrderFromCart).toHaveBeenCalledWith(
        authorization,
        draft,
      );
      expect(response.body).toEqual(order);
    });
  });
});
