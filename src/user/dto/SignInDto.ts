import { IsNotEmpty, IsString } from 'class-validator';

export class SignInRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class SignInResponseDto {
  @IsString()
  user_id: string;

  @IsString()
  username: string;

  @IsString()
  token: string;
}
