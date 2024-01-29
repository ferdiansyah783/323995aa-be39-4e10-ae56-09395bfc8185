import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '../../src/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthService } from '../../src/auth/auth.service';

describe('UsersController', () => {
  let app: INestApplication;
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, AuthService],
      imports: [AuthModule, PrismaModule],
    })
      .overrideProvider(APP_GUARD)
      .useClass(AuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);

    app = module.createNestApplication();
    await app.init();
  });

  it('/GET users unauthorize', () => {
    return request(app.getHttpServer()).get('/users').expect(401);
  });

  it('/GET users authorize', async () => {
    const token = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'admin@gmail.com',
        password: 'password',
      })
      .then((res) => res.body.data.access_token);

    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/GET users access deny', async () => {
    const token = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'employee@gmail.com',
        password: 'password',
      })
      .then((res) => res.body.data.access_token);

    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
