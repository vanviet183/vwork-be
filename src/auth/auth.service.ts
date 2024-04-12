import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const hashPassword = await this.hashPassword(registerUserDto.password);

    const newUser = await this.userRepository.save({
      ...registerUserDto,
      password: hashPassword,
    });

    const payload = { id: newUser.id };
    const { access_token, refresh_token } = await this.generateToken(payload);

    const response = {
      id: newUser.id,
      access_token: access_token,
      refresh_token: refresh_token,
    };
    return response;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
    }
    const checkPass = bcrypt.compareSync(loginUserDto.password, user.password);
    if (!checkPass) {
      throw new HttpException(
        'Password is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    }
    //generate access token and refresh token
    const payload = { id: user.id };
    const { access_token, refresh_token } = await this.generateToken(payload);

    const response = {
      id: user.id,
      access_token: access_token,
      refresh_token: refresh_token,
    };
    return response;
  }

  private async generateToken(payload: { id: number }) {
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: 'vwork',
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
}
