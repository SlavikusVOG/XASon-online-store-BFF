import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiClient,
  ApiClientDraft,
  ApiClientPagedQueryResponse,
  ApiRequest,
} from '@commercetools/platform-sdk';
import { ClientCredentialsService } from '../client-credentials/client-credentials.service';
import { ApiClientsQuery } from './api-clients-query.type';

type CommercetoolsError = {
  statusCode?: number;
  message?: string;
  body?: {
    message?: string;
    errors?: Array<{ message?: string }>;
  };
};

@Injectable()
export class ApiClientsService {
  constructor(
    private readonly clientCredentialsService: ClientCredentialsService,
  ) {}

  getAll(query: ApiClientsQuery = {}): Promise<ApiClientPagedQueryResponse> {
    return this.execute(
      this.getApiClientsRequest().get({
        queryArgs: this.toQueryArgs(query),
      }),
    );
  }

  getById(id: string): Promise<ApiClient> {
    return this.execute(this.getApiClientsRequest().withId({ ID: id }).get());
  }

  create(draft: ApiClientDraft): Promise<ApiClient> {
    return this.execute(
      this.getApiClientsRequest().post({
        body: draft,
      }),
    );
  }

  delete(id: string): Promise<ApiClient> {
    return this.execute(
      this.getApiClientsRequest().withId({ ID: id }).delete(),
    );
  }

  private getApiClientsRequest() {
    return this.clientCredentialsService.createApiRoot().apiClients();
  }

  private async execute<T>(request: ApiRequest<T>): Promise<T> {
    try {
      const response = await request.execute();
      return response.body;
    } catch (error) {
      throw this.toHttpException(error as CommercetoolsError);
    }
  }

  private toQueryArgs(query: ApiClientsQuery) {
    return {
      limit: query.limit,
      offset: query.offset,
      sort: query.sort,
      where: query.where,
      expand: query.expand,
      withTotal: query.withTotal,
    };
  }

  private toHttpException(error: CommercetoolsError) {
    const statusCode = error.statusCode ?? 500;
    const details =
      error.body?.errors?.map((entry) => entry.message).join('; ') ||
      error.body?.message ||
      error.message ||
      'commercetools API clients request failed';

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
