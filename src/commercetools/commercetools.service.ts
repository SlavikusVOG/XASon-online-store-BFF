import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { Client, ClientBuilder } from '@commercetools/ts-client';
import {
  ByProjectKeyCategoriesRequestBuilder,
  ByProjectKeyCustomersRequestBuilder,
  ByProjectKeyOrdersRequestBuilder,
  ByProjectKeyProductProjectionsRequestBuilder,
  ByProjectKeyProductsRequestBuilder,
  ByProjectKeyRequestBuilder,
  ByProjectKeyShoppingListsRequestBuilder,
  Category,
  createApiBuilderFromCtpClient,
  Customer,
  Order,
  Product,
  ProductProjection,
  Project,
} from '@commercetools/platform-sdk';
import { CommercetoolsConfigService } from './config/commercetools-config.service';
import { TestConfigService } from './config/test-online-store-commercetools-config.service';

type CommercetoolsError = {
  statusCode?: number;
  message?: string;
  body?: {
    message?: string;
    errors?: Array<{ message?: string }>;
  };
};

@Injectable({ scope: Scope.DEFAULT })
export class CommercetoolsService {
  private project: Project;

  private readonly ctpClientHttpApi: Client;
  private readonly httpApiRoot: ByProjectKeyRequestBuilder;

  private shoppingListsRequest: ByProjectKeyShoppingListsRequestBuilder;
  private productsRequest: ByProjectKeyProductsRequestBuilder;
  private ordersRequest: ByProjectKeyOrdersRequestBuilder;
  private categoryRequest: ByProjectKeyCategoriesRequestBuilder;
  private productProjectionsRequest: ByProjectKeyProductProjectionsRequestBuilder;
  private customersRequest: ByProjectKeyCustomersRequestBuilder;

  constructor(
    private readonly config: CommercetoolsConfigService,
    private readonly testConfig: TestConfigService,
  ) {
    this.ctpClientHttpApi = new ClientBuilder()
      .withProjectKey(this.config.projectKey)
      .withClientCredentialsFlow(this.config.getAuthMiddlewareOptions())
      .withHttpMiddleware(this.config.getHttpMiddlewareOptions())
      .withLoggerMiddleware()
      .build();

    this.httpApiRoot = createApiBuilderFromCtpClient(
      this.ctpClientHttpApi,
    ).withProjectKey({ projectKey: this.config.projectKey });
    this.addEndpoints();
  }

  async initProject(): Promise<void> {
    const client = new ClientBuilder()
      .withProjectKey(this.testConfig.projectKey)
      .withClientCredentialsFlow(this.testConfig.getAuthMiddlewareOptions())
      .withHttpMiddleware(this.testConfig.getHttpMiddlewareOptions())
      .withLoggerMiddleware()
      .build();

    const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: this.testConfig.projectKey,
    });

    try {
      const response = await apiRoot.get().execute();
      if (response.body) {
        this.project = response.body;
      } else {
        throw new InternalServerErrorException(
          'Problem with connection to Commercetools',
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw this.toHttpException(error as CommercetoolsError);
    }
  }

  private toHttpException(error: CommercetoolsError) {
    const statusCode = error.statusCode ?? 500;
    const details =
      error.body?.errors?.map((entry) => entry.message).join('; ') ||
      error.body?.message ||
      error.message ||
      'commercetools project initialization failed';

    if (statusCode === 400) {
      return new BadRequestException(details);
    }

    if (statusCode === 401 || statusCode === 403) {
      return new UnauthorizedException(details);
    }

    if (statusCode === 404) {
      return new NotFoundException(details);
    }

    return new InternalServerErrorException(details);
  }

  addEndpoints() {
    this.shoppingListsRequest = this.httpApiRoot.shoppingLists();
    this.productsRequest = this.httpApiRoot.products();
    this.ordersRequest = this.httpApiRoot.orders();
    this.categoryRequest = this.httpApiRoot.categories();
    this.customersRequest = this.httpApiRoot.customers();
    this.productProjectionsRequest = this.httpApiRoot.productProjections();
  }

  getApiRoot() {
    return this.httpApiRoot;
  }

  async getOrders(): Promise<Order[]> {
    const response = await this.ordersRequest.get().execute();
    const orders = response.body.results;
    return orders;
  }

  async getProducts(): Promise<Product[]> {
    const response = await this.productsRequest.get().execute();
    const products = response.body.results;
    return products;
  }

  async getProductProjections(id: string): Promise<ProductProjection> {
    const response = await this.productProjectionsRequest
      .withId({ ID: id })
      .get()
      .execute();
    const productProjection = response.body;
    return productProjection;
  }

  async getCategories(): Promise<Category[]> {
    const response = await this.categoryRequest.get().execute();
    const categories = response.body.results;
    return categories;
  }

  async getShoppingLists() {
    const response = await this.shoppingListsRequest.get().execute();
    const shoppingLists = response.body;
    return shoppingLists;
  }

  async getCustomers(): Promise<Customer[]> {
    const response = await this.customersRequest.get().execute();
    const customers = response.body.results;
    return customers;
  }
}
