import { Module } from '@nestjs/common';
import { CommercetoolsConfigService } from '../commercetools/config/commercetools-config.service';
import { CustomerApiService } from './customer-api.service';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { ShoppingListsController } from './shopping-lists/shopping-lists.controller';
import { ShoppingListsService } from './shopping-lists/shopping-lists.service';
import { ActiveCartController } from './carts/active-cart.controller';
import { CartsController } from './carts/carts.controller';
import { CartsService } from './carts/carts.service';

@Module({
  controllers: [
    ProductsController,
    ProfileController,
    OrdersController,
    ShoppingListsController,
    CartsController,
    ActiveCartController,
  ],
  providers: [
    CommercetoolsConfigService,
    CustomerApiService,
    ProductsService,
    ProfileService,
    OrdersService,
    ShoppingListsService,
    CartsService,
  ],
})
export class CustomerModule {}
