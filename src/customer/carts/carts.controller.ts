import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import type { MyCartDraft, MyCartUpdate } from '@commercetools/platform-sdk';
import { CartsService } from './carts.service';
import { AccessToken } from '../decorators/access-token.decorator';
import { QueryParamsDto } from '../dto/query-params.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('me/carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiBearerAuth()
  @Get()
  getCarts(
    @AccessToken() authorization: string,
    @Query() query: QueryParamsDto,
  ) {
    return this.cartsService.getCarts(authorization, query);
  }

  @ApiBearerAuth()
  @Get(':id')
  getCartById(
    @AccessToken() authorization: string,
    @Param('id') id: string,
    @Query() query: QueryParamsDto,
  ) {
    return this.cartsService.getCartById(authorization, id, query);
  }

  @ApiBearerAuth()
  @Post()
  createCart(
    @AccessToken() authorization: string,
    @Body() body: MyCartDraft,
  ) {
    return this.cartsService.createCart(authorization, body);
  }

  @ApiBearerAuth()
  @Post(':id')
  updateCart(
    @AccessToken() authorization: string,
    @Param('id') id: string,
    @Body() body: MyCartUpdate,
  ) {
    return this.cartsService.updateCart(authorization, id, body);
  }
}
