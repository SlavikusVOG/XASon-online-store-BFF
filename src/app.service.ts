import { Injectable, OnModuleInit } from '@nestjs/common';
import { CommercetoolsService } from './commercetools/commercetools.service';
import { Project } from '@commercetools/platform-sdk';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly commercetoolsService: CommercetoolsService) {}

  async onModuleInit(): Promise<void> {
    const project = await this.getProject();
    if (!project) {
      throw new Error('Problem with connection to Commercetools');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getProject(): Promise<Project> {
    return await this.commercetoolsService.getProject();
  }
}
