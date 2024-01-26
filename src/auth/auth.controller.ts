import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  async signup(@Body() signupDto: SignupDto) {
    return {
      data: await this.authService.signup(signupDto),
      statusCode: HttpStatus.OK,
      message: 'Register success',
    };
  }

  @Public()
  @Post('/signin')
  async signin(@Body() signinDto: SigninDto) {
    return {
      data: await this.authService.signin(signinDto),
      statusCode: HttpStatus.OK,
      message: 'Login success',
    };
  }
}
