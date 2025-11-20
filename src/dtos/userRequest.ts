export interface registerDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface loginDto {
  email: string;
  password: string;
}
