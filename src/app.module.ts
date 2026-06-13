import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommercetoolsService } from './commercetools/commercetools.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, CommercetoolsService],
})
export class AppModule {}
