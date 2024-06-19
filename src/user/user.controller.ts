import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SignUpRequestDto } from './dto/SignUpDto';
import { UserService } from './user.service';
import { SignInRequestDto } from './dto/SignInDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { AuthGuard } from 'src/guards/auth.guard';

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

  @Patch('/update_user')
  @UseGuards(AuthGuard)
  handleUpdateUser(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    const { user_id } = req.user;
    try {
      return this.userService.updateUser(updateUserDto, user_id);
    } catch (e) {
      throw e;
    }
  }

  @Delete('/delete_user')
  @UseGuards(AuthGuard)
  async handleDeleteUser(@Request() req) {
    const { user_id } = req.user;

    try {
      await this.userService.deleteUser(user_id);

      return {
        message: 'success',
      };
    } catch (e) {
      throw e;
    }
  }
}
