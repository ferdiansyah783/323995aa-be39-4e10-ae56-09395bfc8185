import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {    
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, PrismaService, JwtService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should be able to login', async () => {
  //   const result = await controller.signin({
  //     email: 'admin@gmail.com',
  //     password: 'password',
  //   });

  //   expect(result).toEqual({
  //     message: 'Login success',
  //     statusCode: 200,
  //     data: {
  //       access_token: expect.any(String),
  //       refresh_token: expect.any(String),
  //     },
  //   });
  // });

  // it('should not be able to register', async () => {
  //   try {
  //     await controller.signup({
  //       name: 'admin',
  //       email: 'admin@gmail.com',
  //       password: 'password',
  //     })
  
  //     fail('Expected BadRequestException, but no exception was thrown');
  //   } catch (error) {
  //     expect(error).toBeInstanceOf(BadRequestException);
  //     expect(error.message).toEqual('Email already exist');
  //   }
  // })

  // it('should be able to signout', async () => {
  //   const token = await controller.signin({
  //     email: 'admin@gmail.com',
  //     password: 'password',
  //   })

  //   const decodeToken = await controller.decodeToken(token.data.access_token)

  //   const modifiedReq: any = {
  //     headers: {
  //       authorization: `Bearer ${token.data.access_token}`,
  //     },
  //     user: {
  //       sessionId: decodeToken.sessionId
  //     }
  //   };

  //   const result = await controller.signout(modifiedReq)

  //   expect(result).toEqual({
  //     statusCode: 200,
  //     message: 'Logout success',
  //   })
  // })

  // it('should able to refresh token', async () => {
  //   const token = await controller.signin({
  //     email: 'admin@gmail.com',
  //     password: 'password',
  //   })

  //   const result = await controller.refreshToken({
  //     refresh_token: token.data.refresh_token
  //   })

  //   expect(result).toEqual({
  //     statusCode: 200,
  //     message: 'Refresh token success',
  //     data: {
  //       access_token: expect.any(String),
  //     },
  //   })
  // })

});
