export class LoginData {
  name: string;
  password: string;
}

export class CreateAccountDto extends LoginData {
  email: string;
}
