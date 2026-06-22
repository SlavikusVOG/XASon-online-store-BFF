import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Client, ClientBuilder } from '@commercetools/ts-client';
import {
  ApiRequest,
  ByProjectKeyRequestBuilder,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import { CommercetoolsConfigService } from '../commercetools/config/commercetools-config.service';

type CommercetoolsError = {
  statusCode?: number;
  message?: string;
  body?: {
    message?: string;
    errors?: Array<{ message?: string }>;
  };
};

@Injectable()
export class CustomerApiService {
  constructor(private readonly config: CommercetoolsConfigService) {}

  createApiRoot(authorization: string): ByProjectKeyRequestBuilder {
    const client = this.createClient(authorization);

    return createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: this.config.projectKey,
    });
  }

  async execute<T>(request: ApiRequest<T>): Promise<T> {
    try {
      const response = await request.execute();
      return response.body;
    } catch (error) {
      throw this.toHttpException(error as CommercetoolsError);
    }
  }

  private createClient(authorization: string): Client {
    return new ClientBuilder()
      .withProjectKey(this.config.projectKey)
      .withExistingTokenFlow(authorization)
      .withHttpMiddleware(this.config.getHttpMiddlewareOptions())
      .withLoggerMiddleware()
      .build();
  }

  private toHttpException(error: CommercetoolsError) {
    const statusCode = error.statusCode ?? 500;
    const details =
      error.body?.errors?.map((entry) => entry.message).join('; ') ||
      error.body?.message ||
      error.message ||
      'commercetools request failed';

    if (statusCode === 400) {
      return new BadRequestException(details);
    }

    if (statusCode === 401 || statusCode === 403) {
      return new UnauthorizedException(details);
    }

    if (statusCode === 404) {
      return new NotFoundException(details);
    }

    return new InternalServerErrorException(details);
  }
}
