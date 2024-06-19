import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SignUpRequestDto } from './dto/SignUpDto';
import { UserService } from './user.service';
import { SignInRequestDto } from './dto/SignInDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { AuthGuard } from 'src/guards/auth.guard';
import { BlockUserDto } from './dto/BlockUserDto';
import { RedisInterceptor } from 'src/redis/redis.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UseInterceptors(RedisInterceptor)
  handleGetUser(@Query('username') username: string) {
    try {
      return this.userService.getUser(username);
    } catch (e) {
      throw e;
    }
  }

  @Get('/search')
  @UseGuards(AuthGuard)
  handleGetUsers(
    @Query('username') username: string,
    @Query('min_age') minAge: number,
    @Query('max_age') maxAge: number,
    @Request() req,
  ) {
    const { user_id } = req.user;

    try {
      return this.userService.getUsers(username, minAge, maxAge, user_id);
    } catch (e) {
      throw e;
    }
  }

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

  @Patch('/block_user')
  @UseGuards(AuthGuard)
  handleBlockUser(@Body() blockUserDto: BlockUserDto, @Request() req) {
    const { user_id } = req.user;
    try {
      this.userService.blockUser(blockUserDto, user_id);

      return {
        message: `user ${blockUserDto.user_id} blocked`,
      };
    } catch (e) {
      throw e;
    }
  }

  @Patch('/unblock_user')
  @UseGuards(AuthGuard)
  handleUnBlockUser(@Body() blockUserDto: BlockUserDto, @Request() req) {
    const { user_id } = req.user;
    try {
      this.userService.unblockUser(blockUserDto, user_id);

      return {
        message: `user ${blockUserDto.user_id} unblocked`,
      };
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
