export type EmailContentType =
  | 'register'
  | 'reset-password'
  | 'activation-code';

export interface EmailContentInterface {
  name: string;
  token: string;
}

export class EmailDataInterface {
  to: string;
  subject: string;
  type: EmailContentType;
  emailContentData: EmailContentInterface;
}
