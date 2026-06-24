import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;

  @ApiProperty({ example: 'secret123' })
  password: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiPropertyOptional({
    description: 'Store key for in-store customer sign-up',
  })
  storeKey?: string;

  @ApiPropertyOptional({
    description:
      'Assigns the customer to carts, orders, and shopping lists with the same anonymousId',
  })
  anonymousId?: string;
}
