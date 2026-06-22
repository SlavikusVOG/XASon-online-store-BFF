export type ApiClientsQuery = {
  limit?: number;
  offset?: number;
  sort?: string;
  where?: string;
  expand?: string;
  withTotal?: boolean;
};
