import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpRequestDto, SignUpResponseDto } from './dto/SignUpDto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/User.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignInRequestDto, SignInResponseDto } from './dto/SignInDto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private merchantModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(signInRequestDto: SignInRequestDto): Promise<SignInResponseDto> {
    const user = await this.merchantModel.findOne({
      username: signInRequestDto.username,
    });

    if (!user) {
      throw new HttpException(
        'no user with that username exists',
        HttpStatus.FORBIDDEN,
      );
    }

    const token = this.jwtService.sign({
      id: user._id,
      name: user.username,
    });

    return {
      user_id: user._id.toString(),
      username: user.username,
      token: token,
    };
  }

  async signUp(signUpRequestDto: SignUpRequestDto): Promise<SignUpResponseDto> {
    const user = await this.merchantModel.findOne({
      username: signUpRequestDto.username,
    });

    if (user) {
      throw new HttpException(
        'user with that username already exists',
        HttpStatus.FORBIDDEN,
      );
    }

    const newUser = await this.merchantModel.create(signUpRequestDto);

    const token = this.jwtService.sign({
      id: newUser._id,
      name: newUser.username,
    });

    return {
      user_id: newUser._id.toString(),
      username: newUser.username,
      token: token,
    };
  }
}
