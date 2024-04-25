export interface ForgotPassword {
  id: string;
  email: string;
  password?: string;
  token: string;
  expires_at: Date;
  created_at: Date;
  used: boolean;
}
