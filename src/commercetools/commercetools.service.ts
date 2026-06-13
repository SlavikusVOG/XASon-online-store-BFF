import { Injectable } from '@nestjs/common';
import {
  Client,
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/ts-client';
import {
  ApiRoot,
  createApiBuilderFromCtpClient,
  Project,
} from '@commercetools/platform-sdk';

@Injectable()
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

  // Export the ClientBuilder for the HTTP API
  private readonly ctpClientHttpApi: Client;
  private readonly httpApiRoot: ApiRoot;

  constructor() {
    this.scopes = [
      `manage_orders:${this.envVariables.PROJECT_KEY}`,
      `manage_order_edits:${this.envVariables.PROJECT_KEY}`,
      `manage_sessions:${this.envVariables.PROJECT_KEY}`,
      `manage_shopping_lists:${this.envVariables.PROJECT_KEY}`,
      `manage_customers:${this.envVariables.PROJECT_KEY}`,
      `view_types:${this.envVariables.PROJECT_KEY}`,
      `view_product_selections:${this.envVariables.PROJECT_KEY}`,
      `view_categories:${this.envVariables.PROJECT_KEY}`,
      `view_shipping_methods:${this.envVariables.PROJECT_KEY}`,
      `view_project_settings:${this.envVariables.PROJECT_KEY}`,
      `view_cart_discounts:${this.envVariables.PROJECT_KEY}`,
      `view_discount_codes:${this.envVariables.PROJECT_KEY}`,
      `view_sessions:${this.envVariables.PROJECT_KEY}`,
      `view_tax_categories:${this.envVariables.PROJECT_KEY}`,
      `view_standalone_prices:${this.envVariables.PROJECT_KEY}`,
      `view_products:${this.envVariables.PROJECT_KEY}`,
      `view_published_products:${this.envVariables.PROJECT_KEY}`,
      `view_published_products:${this.envVariables.PROJECT_KEY}`,
      `create_anonymous_token:${this.envVariables.PROJECT_KEY}`,
    ];

    this.authMiddlewareOptions = {
      host: `https://auth.${this.region}.commercetools.com`,
      projectKey: this.envVariables.PROJECT_KEY ?? '',
      credentials: {
        clientId: this.envVariables.CLIENT_ID ?? '',
        clientSecret: this.envVariables.CLIENT_SECRET ?? '',
      },
      scopes: this.scopes,
      httpClient: fetch,
    };

    this.ctpClientHttpApi = new ClientBuilder()
      .withProjectKey(this.envVariables.PROJECT_KEY ?? '')
      .withClientCredentialsFlow(this.authMiddlewareOptions)
      .withHttpMiddleware(this.httpAPIHTTPMiddlewareOptions)
      .withLoggerMiddleware() // Include middleware for logging
      .build();

    this.httpApiRoot = createApiBuilderFromCtpClient(this.ctpClientHttpApi);
  }

  async getProject(): Promise<Project> {
    const response = await this.httpApiRoot
      .withProjectKey({ projectKey: this.envVariables.PROJECT_KEY ?? '' })
      .get()
      .execute();
    return response.body;
  }
}
