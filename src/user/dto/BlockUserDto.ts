import { IsNotEmpty, IsString } from 'class-validator';

export class BlockUserDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;
}
