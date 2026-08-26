export interface IEmailService {
  sendActivationEmail(email: string, token: string, userName: string): Promise<void>;
  verifyConnection(): Promise<boolean>;
}
