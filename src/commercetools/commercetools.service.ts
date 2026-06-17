import { Injectable, Scope } from '@nestjs/common';
import {
  Client,
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/ts-client';
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

@Injectable({ scope: Scope.DEFAULT })
export class CommercetoolsService {
  private readonly envVariables = {
    PROJECT_KEY: process.env.PROJECT_KEY,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
  };

  private readonly scopes: string[];

  private readonly authMiddlewareOptions: AuthMiddlewareOptions;

  private readonly region: string = 'europe-west1.gcp';

  // Configure HTTP API httpMiddlewareOptions
  private readonly httpAPIHTTPMiddlewareOptions: HttpMiddlewareOptions = {
    host: `https://api.${this.region}.commercetools.com`,
    httpClient: fetch,
  };

  private project: Project;

  // Export the ClientBuilder for the HTTP API
  private readonly ctpClientHttpApi: Client;
  private readonly httpApiRoot: ByProjectKeyRequestBuilder;

  private shoppingListsRequest: ByProjectKeyShoppingListsRequestBuilder;
  private productsRequest: ByProjectKeyProductsRequestBuilder;
  private ordersRequest: ByProjectKeyOrdersRequestBuilder;
  private categoryRequest: ByProjectKeyCategoriesRequestBuilder;
  private customerRequest: ByProjectKeyCustomersRequestBuilder;
  private productProjectionsRequest: ByProjectKeyProductProjectionsRequestBuilder;
  private customersRequest: ByProjectKeyCustomersRequestBuilder;

  constructor() {
    const projectKey = this.envVariables.PROJECT_KEY ?? '';

    this.scopes = [
      `manage_orders:${projectKey}`,
      `manage_order_edits:${projectKey}`,
      `manage_sessions:${projectKey}`,
      `manage_shopping_lists:${projectKey}`,
      `manage_customers:${projectKey}`,
      `view_types:${projectKey}`,
      `view_product_selections:${projectKey}`,
      `view_categories:${projectKey}`,
      `view_shipping_methods:${projectKey}`,
      `view_project_settings:${projectKey}`,
      `view_cart_discounts:${projectKey}`,
      `view_discount_codes:${projectKey}`,
      `view_sessions:${projectKey}`,
      `view_tax_categories:${projectKey}`,
      `view_standalone_prices:${projectKey}`,
      `view_products:${projectKey}`,
      `view_published_products:${projectKey}`,
      `view_published_products:${projectKey}`,
      `create_anonymous_token:${projectKey}`,
    ];

    this.authMiddlewareOptions = {
      host: `https://auth.${this.region}.commercetools.com`,
      projectKey,
      credentials: {
        clientId: this.envVariables.CLIENT_ID ?? '',
        clientSecret: this.envVariables.CLIENT_SECRET ?? '',
      },
      scopes: this.scopes,
      httpClient: fetch,
    };

    this.ctpClientHttpApi = new ClientBuilder()
      .withProjectKey(projectKey)
      .withClientCredentialsFlow(this.authMiddlewareOptions)
      .withHttpMiddleware(this.httpAPIHTTPMiddlewareOptions)
      .withLoggerMiddleware() // Include middleware for logging
      .build();

    this.httpApiRoot = createApiBuilderFromCtpClient(
      this.ctpClientHttpApi,
    ).withProjectKey({ projectKey });
    this.addEndpoints();
  }

  async initProject(): Promise<void> {
    const response = await this.httpApiRoot.get().execute();
    if (response.body) {
      this.project = response.body;
    } else {
      throw new Error('Problem with connection to Commercetools');
    }
  }

  addEndpoints() {
    this.shoppingListsRequest = this.httpApiRoot.shoppingLists();
    this.productsRequest = this.httpApiRoot.products();
    this.ordersRequest = this.httpApiRoot.orders();
    this.categoryRequest = this.httpApiRoot.categories();
    this.customerRequest = this.httpApiRoot.customers();
    this.productProjectionsRequest = this.httpApiRoot.productProjections();
    this.customersRequest = this.httpApiRoot.customers();
  }

  getApiRoot() {
    return this.httpApiRoot;
  }

  async getOrders(): Promise<Order[]> {
    const response = await this.ordersRequest.get().execute();
    const orders = response.body.results;
    return orders;
  }

  // async postOrder(order: Order) {}

  // async putOrder(order: Order) {}

  // async deleteOrder(order: Order) {}

  // TODO: use Product search API (https://docs.commercetools.com/api/projects/product-search)
  async getProducts(): Promise<Product[]> {
    const response = await this.productsRequest.get().execute();
    const products = response.body.results;
    return products;
  }

  // TODO: use Product Projections API (https://docs.commercetools.com/api/projects/productProjections)
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
