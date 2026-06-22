import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AnonymousSessionDto } from './dto/anonymous-session.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RevokeTokenDto } from './dto/revoke-token.dto';
import { IntrospectTokenDto } from './dto/introspect-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('anonymous')
  anonymous(@Body() dto: AnonymousSessionDto) {
    return this.authService.createAnonymousSession(dto.anonymousId);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password, dto.storeKey);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  async logout(@Body() dto: RevokeTokenDto) {
    await this.authService.revoke(dto.token, dto.tokenTypeHint);
    return { success: true };
  }

  @Post('introspect')
  introspect(@Body() dto: IntrospectTokenDto) {
    return this.authService.introspect(dto.token);
  }
}
