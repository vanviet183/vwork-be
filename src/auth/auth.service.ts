import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
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
    const { accessToken, refreshToken } = await this.generateToken(payload);

    const response = {
      userId: newUser.id,
      accessToken,
      refreshToken,
      role: newUser.role,
    };
    return response;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOneBy({
      email: loginUserDto.email,
    });
    if (!user) {
      throw new HttpException('User is not exist', HttpStatus.UNAUTHORIZED);
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
    const { accessToken, refreshToken } = await this.generateToken(payload);

    const response = {
      userId: user.id,
      accessToken,
      refreshToken,
      role: user.role,
    };
    return response;
  }

  private async generateToken(payload: { id: number }) {
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: 'vwork',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
}
