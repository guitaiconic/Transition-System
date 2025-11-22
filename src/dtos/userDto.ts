import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
} from "class-validator";

export class RegisterDto {
  @IsNotEmpty({ message: "First name is required" })
  @IsString()
  firstName!: string;

  @IsNotEmpty({ message: "Last name is required" })
  @IsString()
  lastName!: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email format is invalid" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: "Password must contain letters and numbers",
  })
  password!: string;

  @IsNotEmpty({ message: "Role is required" })
  @IsString()
  role!: string;
}
