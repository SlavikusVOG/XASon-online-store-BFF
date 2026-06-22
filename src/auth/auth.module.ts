import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CommercetoolsConfigService } from '../commercetools/config/commercetools-config.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, CommercetoolsConfigService],
})
export class AuthModule {}
