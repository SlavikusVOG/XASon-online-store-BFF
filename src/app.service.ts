import { Injectable, OnModuleInit } from '@nestjs/common';
import { CommercetoolsService } from './commercetools/commercetools.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly commercetoolsService: CommercetoolsService) {}

  async onModuleInit(): Promise<void> {
    await this.commercetoolsService.initProject();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
