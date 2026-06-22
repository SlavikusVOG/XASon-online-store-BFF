import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import type { MyOrderFromCartDraft } from '@commercetools/platform-sdk';
import { OrdersService } from './orders.service';
import { AccessToken } from '../decorators/access-token.decorator';
import { QueryParamsDto } from '../dto/query-params.dto';

@Controller('me/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrders(
    @AccessToken() authorization: string,
    @Query() query: QueryParamsDto,
  ) {
    return this.ordersService.getOrders(authorization, query);
  }

  @Get(':id')
  getOrderById(
    @AccessToken() authorization: string,
    @Param('id') id: string,
    @Query() query: QueryParamsDto,
  ) {
    return this.ordersService.getOrderById(authorization, id, query);
  }

  @Post()
  createOrderFromCart(
    @AccessToken() authorization: string,
    @Body() body: MyOrderFromCartDraft,
  ) {
    return this.ordersService.createOrderFromCart(authorization, body);
  }
}
