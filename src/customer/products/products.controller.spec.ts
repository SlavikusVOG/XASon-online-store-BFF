import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let app: INestApplication<App>;

  const productsService = {
    getProducts: jest.fn(),
    getProductById: jest.fn(),
  };

  const authorization = 'Bearer access-token';

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: productsService }],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /products', () => {
    it('returns 401 without authorization header', () => {
      return request(app.getHttpServer()).get('/products').expect(401);
    });

    it('returns product projections', async () => {
      const products = { results: [{ id: 'product-1' }], total: 1 };
      productsService.getProducts.mockResolvedValue(products);

      const response = await request(app.getHttpServer())
        .get('/products')
        .query({ limit: 10, offset: 0 })
        .set('Authorization', authorization)
        .expect(200);

      expect(productsService.getProducts).toHaveBeenCalledWith(
        authorization,
        expect.objectContaining({ limit: '10', offset: '0' }),
      );
      expect(response.body).toEqual(products);
    });
  });

  describe('GET /products/:id', () => {
    it('returns a product by id', async () => {
      const product = { id: 'product-1', name: { en: 'Product' } };
      productsService.getProductById.mockResolvedValue(product);

      const response = await request(app.getHttpServer())
        .get('/products/product-1')
        .set('Authorization', authorization)
        .expect(200);

      expect(productsService.getProductById).toHaveBeenCalledWith(
        authorization,
        'product-1',
        expect.any(Object),
      );
      expect(response.body).toEqual(product);
    });
  });
});
