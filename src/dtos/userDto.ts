import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
} from "class-validator";

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: "Full name is required" })
  fullName!: string;

  @IsEmail({}, { message: "Email format is invalid" })
  email!: string;

  @MinLength(6, { message: "Password must be at least 6 characters" })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: "Password must contain letters and numbers",
  })
  password!: string;

  @IsNotEmpty({ message: "Role is required" })
  @IsString()
  role!: string;
}

export class LoginDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email format is invalid" })
  email!: string;

  @IsNotEmpty({ message: "Pasword is required" })
  @MinLength(6, { message: "Pasword must be at least 6 characters" })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/)
  password!: string;
}
