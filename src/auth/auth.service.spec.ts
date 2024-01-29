import { User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should be able to login', async () => {
  //   const result = await service.signin({
  //     email: 'admin@gmail.com',
  //     password: 'password',
  //   });
  //   expect(result).toHaveProperty('access_token');
  //   expect(result).toHaveProperty('refresh_token');
  // });

  // it('should not be able to signup', async () => {
  //   try {
  //     await service.signup({
  //       name: 'admin',
  //       email: 'admin@gmail.com',
  //       password: 'password',
  //     });
  
  //     fail('Expected BadRequestException, but no exception was thrown');
  //   } catch (error) {
  //     expect(error).toBeInstanceOf(BadRequestException);
  //     expect(error.message).toEqual('Email already exist');
  //   }
  // });

  // it('should be able to signout', async () => {
  //   const token = await service.signin({
  //     email: 'admin@gmail.com',
  //     password: 'password',
  //   });

  //   const decodeToken = await service.decodeToken(token.access_token);

  //   const result = await service.signout(
  //     decodeToken.sessionId,
  //     token.access_token,
  //   );

  //   expect(result).toBeUndefined();
  // });

  // it('should be able to refresh token', async () => {
  //   const token = await service.signin({
  //     email: 'admin@gmail.com',
  //     password: 'password',
  //   });

  //   const result = await service.refreshToken(token.refresh_token)

  //   expect(result).toHaveProperty('access_token');
  // })
});
