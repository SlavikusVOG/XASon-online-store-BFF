import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AccessToken } from '../decorators/access-token.decorator';
import { QueryParamsDto } from '../dto/query-params.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts(
    @AccessToken() authorization: string,
    @Query() query: QueryParamsDto,
  ) {
    return this.productsService.getProducts(authorization, query);
  }

  @Get(':id')
  getProductById(
    @AccessToken() authorization: string,
    @Param('id') id: string,
    @Query() query: QueryParamsDto,
  ) {
    return this.productsService.getProductById(authorization, id, query);
  }
}
