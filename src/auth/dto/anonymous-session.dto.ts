import { ApiPropertyOptional } from '@nestjs/swagger';

export class AnonymousSessionDto {
  @ApiPropertyOptional({ example: '1234567890', description: 'Anonymous ID' })
  anonymousId?: string;
}
