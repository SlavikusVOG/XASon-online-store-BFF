export class RevokeTokenDto {
  token: string;
  tokenTypeHint?: 'access_token' | 'refresh_token';
}
