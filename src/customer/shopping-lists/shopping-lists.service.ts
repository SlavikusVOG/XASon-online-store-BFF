import { Injectable } from '@nestjs/common';
import {
  MyShoppingListDraft,
  MyShoppingListUpdate,
  ShoppingList,
} from '@commercetools/platform-sdk';
import { CustomerApiService } from '../customer-api.service';
import { QueryParamsDto } from '../dto/query-params.dto';

@Injectable()
export class ShoppingListsService {
  constructor(private readonly customerApi: CustomerApiService) {}

  getShoppingLists(authorization: string, query: QueryParamsDto) {
    const apiRoot = this.customerApi.createApiRoot(authorization);

    return this.customerApi.execute(
      apiRoot
        .me()
        .shoppingLists()
        .get({
          queryArgs: this.toQueryArgs(query),
        }),
    );
  }

  getShoppingListById(
    authorization: string,
    id: string,
    query: QueryParamsDto,
  ) {
    const apiRoot = this.customerApi.createApiRoot(authorization);

    return this.customerApi.execute<ShoppingList>(
      apiRoot
        .me()
        .shoppingLists()
        .withId({ ID: id })
        .get({
          queryArgs: this.toQueryArgs(query),
        }),
    );
  }

  createShoppingList(authorization: string, body: MyShoppingListDraft) {
    const apiRoot = this.customerApi.createApiRoot(authorization);

    return this.customerApi.execute(
      apiRoot.me().shoppingLists().post({ body }),
    );
  }

  updateShoppingList(
    authorization: string,
    id: string,
    body: MyShoppingListUpdate,
  ) {
    const apiRoot = this.customerApi.createApiRoot(authorization);

    return this.customerApi.execute(
      apiRoot.me().shoppingLists().withId({ ID: id }).post({ body }),
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
