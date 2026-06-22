import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import type {
  MyShoppingListDraft,
  MyShoppingListUpdate,
} from '@commercetools/platform-sdk';
import { ShoppingListsService } from './shopping-lists.service';
import { AccessToken } from '../decorators/access-token.decorator';
import { QueryParamsDto } from '../dto/query-params.dto';

@Controller('me/shopping-lists')
export class ShoppingListsController {
  constructor(private readonly shoppingListsService: ShoppingListsService) {}

  @Get()
  getShoppingLists(
    @AccessToken() authorization: string,
    @Query() query: QueryParamsDto,
  ) {
    return this.shoppingListsService.getShoppingLists(authorization, query);
  }

  @Get(':id')
  getShoppingListById(
    @AccessToken() authorization: string,
    @Param('id') id: string,
    @Query() query: QueryParamsDto,
  ) {
    return this.shoppingListsService.getShoppingListById(
      authorization,
      id,
      query,
    );
  }

  @Post()
  createShoppingList(
    @AccessToken() authorization: string,
    @Body() body: MyShoppingListDraft,
  ) {
    return this.shoppingListsService.createShoppingList(authorization, body);
  }

  @Post(':id')
  updateShoppingList(
    @AccessToken() authorization: string,
    @Param('id') id: string,
    @Body() body: MyShoppingListUpdate,
  ) {
    return this.shoppingListsService.updateShoppingList(
      authorization,
      id,
      body,
    );
  }
}
