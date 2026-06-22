import { Injectable } from '@nestjs/common';
import { ProductProjection } from '@commercetools/platform-sdk';
import { CustomerApiService } from '../customer-api.service';
import { QueryParamsDto } from '../dto/query-params.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly customerApi: CustomerApiService) {}

  getProducts(authorization: string, query: QueryParamsDto) {
    const apiRoot = this.customerApi.createApiRoot(authorization);

    return this.customerApi.execute(
      apiRoot.productProjections().get({
        queryArgs: this.toQueryArgs(query),
      }),
    );
  }

  getProductById(authorization: string, id: string, query: QueryParamsDto) {
    const apiRoot = this.customerApi.createApiRoot(authorization);

    return this.customerApi.execute<ProductProjection>(
      apiRoot
        .productProjections()
        .withId({ ID: id })
        .get({
          queryArgs: this.toQueryArgs(query),
        }),
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
