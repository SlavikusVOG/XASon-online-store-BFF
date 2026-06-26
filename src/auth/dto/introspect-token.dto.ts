import { ApiProperty } from '@nestjs/swagger';

export class IntrospectTokenDto {
  @ApiProperty({ example: '1234567890', description: 'Token' })
  token: string;
}
