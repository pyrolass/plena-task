import { Body, Controller, Post } from '@nestjs/common';
import { SignUpRequestDto } from './dto/SignUpDto';
import { UserService } from './user.service';
import { SignInRequestDto } from './dto/SignInDto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign_in')
  handleSignIn(@Body() signInRequestDto: SignInRequestDto) {
    try {
      return this.userService.signIn(signInRequestDto);
    } catch (e) {
      throw e;
    }
  }

  @Post('/sign_up')
  handleSignUp(@Body() signUpRequestDto: SignUpRequestDto) {
    try {
      return this.userService.signUp(signUpRequestDto);
    } catch (e) {
      throw e;
    }
  }
}
