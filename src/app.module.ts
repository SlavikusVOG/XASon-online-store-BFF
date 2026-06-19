import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommercetoolsService } from './commercetools/commercetools.service';
import { AnonymousSessionService } from './commercetools/anonymous-session/anonymous-session.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, CommercetoolsService, AnonymousSessionService],
})
export class AppModule {}
