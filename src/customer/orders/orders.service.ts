import { Injectable } from '@nestjs/common';
import { MyOrderFromCartDraft, Order } from '@commercetools/platform-sdk';
import { CustomerApiService } from '../customer-api.service';
import { QueryParamsDto } from '../dto/query-params.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly customerApi: CustomerApiService) {}

  getOrders(authorization: string, query: QueryParamsDto) {
    const apiRoot = this.customerApi.createApiRoot(authorization);

    return this.customerApi.execute(
      apiRoot
        .me()
        .orders()
        .get({
          queryArgs: this.toQueryArgs(query),
        }),
    );
  }

  getOrderById(authorization: string, id: string, query: QueryParamsDto) {
    const apiRoot = this.customerApi.createApiRoot(authorization);

    return this.customerApi.execute<Order>(
      apiRoot
        .me()
        .orders()
        .withId({ ID: id })
        .get({
          queryArgs: this.toQueryArgs(query),
        }),
    );
  }

  createOrderFromCart(authorization: string, body: MyOrderFromCartDraft) {
    const apiRoot = this.customerApi.createApiRoot(authorization);

    return this.customerApi.execute(apiRoot.me().orders().post({ body }));
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
