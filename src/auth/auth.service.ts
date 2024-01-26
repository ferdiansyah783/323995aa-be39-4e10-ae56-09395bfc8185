import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import * as uuid from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    try {
      const isExistEmail = await this.prismaService.user.findFirst({
        where: {
          email: signupDto.email,
        },
      });

      if (isExistEmail) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Email already exist',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const role = await this.prismaService.role.findFirst({
        where: {
          name: 'employee',
        },
      });

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(signupDto.password, salt);

      const user = await this.prismaService.user.create({
        data: {
          name: signupDto.name,
          email: signupDto.email,
          password: hashPassword,
          roleId: role.id,
        },
      });

      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signin(signinDto: SigninDto) {
    const existUser = await this.prismaService.user.findFirst({
      where: {
        email: signinDto.email,
      },
      include: {
        role: true,
      },
    });

    if (
      existUser &&
      (await bcrypt.compare(signinDto.password, existUser.password))
    ) {
      const session = await this.prismaService.session.create({
        data: {
          user_id: existUser.id,
          refresh_token: uuid.v4(),
          status: 'active',
        },
      });

      const accessToken = await this.jwtService.signAsync(
        {
          sub: existUser.id,
          name: existUser.name,
          role: existUser.role.name,
          session_id: session.id,
        },
        {
          expiresIn: '1d',
        },
      );

      return {
        access_token: accessToken,
        refresh_token: session.refresh_token,
      };
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Invalid credentials',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
