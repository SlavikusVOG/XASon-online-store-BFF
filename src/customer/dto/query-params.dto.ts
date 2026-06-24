export class QueryParamsDto {
  limit?: number;
  offset?: number;
  sort?: string;
  where?: string;
  expand?: string;
  withTotal?: boolean;
}
