import type { Cart, Customer } from '@commercetools/platform-sdk';
import type { CommercetoolsTokenResponse } from './commercetools-token-response.type';

export type SignupResponse = CommercetoolsTokenResponse & {
  customer: Customer;
  cart?: Cart;
};
