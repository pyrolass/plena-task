import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpRequestDto, SignUpResponseDto } from './dto/SignUpDto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/User.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignInRequestDto, SignInResponseDto } from './dto/SignInDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { BlockUserDto } from './dto/BlockUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(signInRequestDto: SignInRequestDto): Promise<SignInResponseDto> {
    const user = await this.userModel.findOne({
      username: signInRequestDto.username,
      is_delete: false,
    });

    if (!user) {
      throw new HttpException(
        'no user with that username exists',
        HttpStatus.FORBIDDEN,
      );
    }

    const token = this.jwtService.sign({
      user_id: user._id,
    });

    return {
      user_id: user._id.toString(),
      username: user.username,
      token: token,
    };
  }

  async signUp(signUpRequestDto: SignUpRequestDto): Promise<SignUpResponseDto> {
    const user = await this.userModel.findOne({
      username: signUpRequestDto.username,
      is_delete: false,
    });

    if (user) {
      throw new HttpException(
        'user with that username already exists',
        HttpStatus.FORBIDDEN,
      );
    }

    const newUser = await this.userModel.create(signUpRequestDto);

    const token = this.jwtService.sign({
      user_id: newUser._id,
    });

    return {
      user_id: newUser._id.toString(),
      username: newUser.username,
      token: token,
    };
  }

  async updateUser(updateUserDto: UpdateUserDto, user_id: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      user_id,
      { $set: updateUserDto, updated_at: Date.now() },
      { new: true },
    );

    return updatedUser;
  }

  async deleteUser(user_id: string) {
    return this.userModel.findByIdAndUpdate(
      user_id,
      {
        $set: {
          is_delete: true,
          updated_at: Date.now(),
        },
      },
      { new: true },
    );
  }

  async blockUser(blockUserDto: BlockUserDto, user_id: string) {
    if (blockUserDto.user_id === user_id) {
      throw new HttpException('Cannot block yourself', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userModel.findById(blockUserDto.user_id);

    if (!user) {
      throw new HttpException('no user found to block', HttpStatus.NOT_FOUND);
    }

    return await this.userModel.findByIdAndUpdate(user_id, {
      $addToSet: { blocked_users: blockUserDto.user_id },
    });
  }
}
