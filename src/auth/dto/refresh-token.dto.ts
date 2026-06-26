import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: '1234567890', description: 'Refresh Token' })
  refreshToken: string;
}
