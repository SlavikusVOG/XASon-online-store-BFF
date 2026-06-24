import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'password' })
  password: string;

  @ApiPropertyOptional({ description: 'store-key' })
  storeKey?: string;
}
