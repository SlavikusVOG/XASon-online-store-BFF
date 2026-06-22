import { Injectable } from '@nestjs/common';
import { MyCustomerUpdate } from '@commercetools/platform-sdk';
import { CustomerApiService } from '../customer-api.service';

@Injectable()
export class ProfileService {
  constructor(private readonly customerApi: CustomerApiService) {}

  getProfile(authorization: string) {
    const apiRoot = this.customerApi.createApiRoot(authorization);

    return this.customerApi.execute(apiRoot.me().get());
  }

  updateProfile(authorization: string, body: MyCustomerUpdate) {
    const apiRoot = this.customerApi.createApiRoot(authorization);

    return this.customerApi.execute(apiRoot.me().post({ body }));
  }
}
