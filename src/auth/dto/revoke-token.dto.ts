import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RevokeTokenDto {
  @ApiProperty({ example: '1234567890', description: 'Token' })
  token: string;

  @ApiPropertyOptional({
    example: 'access_token',
    description: 'Token Type Hint',
  })
  tokenTypeHint?: 'access_token' | 'refresh_token';
}
