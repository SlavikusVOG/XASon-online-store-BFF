import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AnonymousSessionDto } from './dto/anonymous-session.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RevokeTokenDto } from './dto/revoke-token.dto';
import { IntrospectTokenDto } from './dto/introspect-token.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('anonymous')
  anonymous(@Body() dto: AnonymousSessionDto) {
    return this.authService.createAnonymousSession(dto.anonymousId);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password, dto.storeKey);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new customer' })
  @ApiBody({ type: SignupDto })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
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
