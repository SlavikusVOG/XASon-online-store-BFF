import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'user@example.com', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'password', example: 'password' })
  password: string;

  @ApiPropertyOptional({ description: 'store-key', example: 'store-key' })
  storeKey?: string;
}
