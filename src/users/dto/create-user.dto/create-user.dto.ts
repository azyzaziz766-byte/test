import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';

import { UserRole } from 'src/common/enums/user-role.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}