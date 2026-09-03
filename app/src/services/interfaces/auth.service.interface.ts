import { RegisterDto } from '../../dto/register.dto';
import { ForgotPasswordDto } from '../../dto/forgot-password.dto';
import { ResetPasswordDto } from '../../dto/reset-password.dto';
import type { Request } from 'express';

export interface IAuthService {
  getCaptcha(): Promise<{ token: string; question: string }>;
  register(dto: RegisterDto): Promise<{ message: string; userId: number }>;
  activateAccount(token: string): Promise<{ message: string }>;
  forgotPassword(dto: ForgotPasswordDto, req: Request): Promise<{ message: string }>;
  resetPassword(dto: ResetPasswordDto, req: Request): Promise<{ message: string }>;
  login(email: string, password: string, req: Request): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { role: string; id: number; name: string; membership: string };
  }>;
  refresh(refreshToken: string, req: Request): Promise<{ accessToken: string; refreshToken: string }>;
  logout(userId: number | null, req: Request): Promise<{ message: string }>;
  logAccessAudit(params: {
    userId: number | null;
    action: 'login' | 'login_failed' | 'refresh' | 'logout' | 'password_reset_requested' | 'password_reset' | 'account_activated';
    success: boolean;
    req: Request;
    details?: string;
  }): Promise<void>;
}
