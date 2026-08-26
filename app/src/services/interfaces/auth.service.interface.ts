import { RegisterDto } from '../../dto/register.dto';
import { ActivateAccountDto } from '../../dto/activate-account.dto';

export interface IAuthService {
  getCaptcha(): Promise<{ token: string; question: string }>;
  register(dto: RegisterDto): Promise<{ message: string; userId: number }>;
  activateAccount(dto: ActivateAccountDto): Promise<{ message: string }>;
}
