import { Injectable } from '@nestjs/common';
import type { HttpMiddlewareOptions } from '@commercetools/ts-client';
import type { AuthMiddlewareOptions } from '../types/auth-options.type';

@Injectable()
export class CommercetoolsConfigService {
  readonly region = 'europe-west1.gcp';

  readonly projectKey = process.env.PROJECT_KEY ?? '';

  readonly credentials = {
    clientId: process.env.CLIENT_ID ?? '',
    clientSecret: process.env.CLIENT_SECRET ?? '',
  };

  readonly authHost = `https://auth.${this.region}.commercetools.com`;

  readonly apiHost = `https://api.${this.region}.commercetools.com`;

  readonly scopes = [
    `manage_orders:${this.projectKey}`,
    `manage_order_edits:${this.projectKey}`,
    `manage_sessions:${this.projectKey}`,
    `manage_shopping_lists:${this.projectKey}`,
    `manage_customers:${this.projectKey}`,
    `view_types:${this.projectKey}`,
    `view_product_selections:${this.projectKey}`,
    `view_categories:${this.projectKey}`,
    `view_shipping_methods:${this.projectKey}`,
    `view_project_settings:${this.projectKey}`,
    `view_cart_discounts:${this.projectKey}`,
    `view_discount_codes:${this.projectKey}`,
    `view_sessions:${this.projectKey}`,
    `view_tax_categories:${this.projectKey}`,
    `view_standalone_prices:${this.projectKey}`,
    `view_products:${this.projectKey}`,
    `view_published_products:${this.projectKey}`,
    `create_anonymous_token:${this.projectKey}`,
    `manage_api_clients:${this.projectKey}`,
  ];

  readonly customerScopes = [
    `view_published_products:${this.projectKey}`,
    `manage_my_orders:${this.projectKey}`,
    `manage_my_profile:${this.projectKey}`,
    `manage_my_shopping_lists:${this.projectKey}`,
    `create_anonymous_token:${this.projectKey}`,
  ];

  getHttpMiddlewareOptions(): HttpMiddlewareOptions {
    return {
      host: this.apiHost,
      httpClient: fetch,
    };
  }

  getAuthMiddlewareOptions(): AuthMiddlewareOptions {
    return {
      host: this.authHost,
      projectKey: this.projectKey,
      credentials: this.credentials,
      scopes: this.scopes,
      httpClient: fetch,
    };
  }
}
