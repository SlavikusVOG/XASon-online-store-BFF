import { Injectable } from '@nestjs/common';
import {
  Cart,
  MyCartDraft,
  MyCartUpdate,
} from '@commercetools/platform-sdk';
import { CustomerApiService } from '../customer-api.service';
import { QueryParamsDto } from '../dto/query-params.dto';

@Injectable()
export class CartsService {
  constructor(private readonly customerApi: CustomerApiService) {}

  getCarts(authorization: string, query: QueryParamsDto) {
    const apiRoot = this.customerApi.createApiRoot(authorization);

    return this.customerApi.execute(
      apiRoot
        .me()
        .carts()
        .get({
          queryArgs: this.toQueryArgs(query),
        }),
    );
  }

  getCartById(authorization: string, id: string, query: QueryParamsDto) {
    const apiRoot = this.customerApi.createApiRoot(authorization);

    return this.customerApi.execute<Cart>(
      apiRoot
        .me()
        .carts()
        .withId({ ID: id })
        .get({
          queryArgs: this.toQueryArgs(query),
        }),
    );
  }

  getActiveCart(authorization: string, query: QueryParamsDto) {
    const apiRoot = this.customerApi.createApiRoot(authorization);

    return this.customerApi.execute<Cart>(
      apiRoot
        .me()
        .activeCart()
        .get({
          queryArgs: {
            expand: query.expand,
          },
        }),
    );
  }

  createCart(authorization: string, body: MyCartDraft) {
    const apiRoot = this.customerApi.createApiRoot(authorization);

    return this.customerApi.execute(
      apiRoot
        .me()
        .carts()
        .post({ body })
    );
  }

  updateCart(authorization: string, id: string, body: MyCartUpdate) {
    const apiRoot = this.customerApi.createApiRoot(authorization);

    return this.customerApi.execute(
      apiRoot
        .me()
        .carts()
        .withId({ ID: id })
        .post({ body }),
    );
  }

  private toQueryArgs(query: QueryParamsDto) {
    return {
      limit: query.limit,
      offset: query.offset,
      sort: query.sort,
      where: query.where,
      expand: query.expand,
      withTotal: query.withTotal,
    };
  }
}
