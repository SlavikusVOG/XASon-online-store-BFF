import { Body, Controller, Get, Post } from '@nestjs/common';
import type { MyCustomerUpdate } from '@commercetools/platform-sdk';
import { ProfileService } from './profile.service';
import { AccessToken } from '../decorators/access-token.decorator';

@Controller('me')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@AccessToken() authorization: string) {
    return this.profileService.getProfile(authorization);
  }

  @Post()
  updateProfile(
    @AccessToken() authorization: string,
    @Body() body: MyCustomerUpdate,
  ) {
    return this.profileService.updateProfile(authorization, body);
  }
}
