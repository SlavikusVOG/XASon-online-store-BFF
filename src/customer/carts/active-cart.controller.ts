import { Controller, Get, Query } from '@nestjs/common';
import { CartsService } from './carts.service';
import { AccessToken } from '../decorators/access-token.decorator';
import { QueryParamsDto } from '../dto/query-params.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('me/active-cart')
export class ActiveCartController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiBearerAuth()
  @Get()
  getActiveCart(
    @AccessToken() authorization: string,
    @Query() query: QueryParamsDto,
  ) {
    return this.cartsService.getActiveCart(authorization, query);
  }
}
