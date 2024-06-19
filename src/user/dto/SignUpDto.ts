import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsString()
  @IsNotEmpty()
  birthdate: string;
}

export class SignUpResponseDto {
  @IsString()
  user_id: string;

  @IsString()
  username: string;

  @IsString()
  token: string;
}
