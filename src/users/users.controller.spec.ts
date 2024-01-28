import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('UsersController', () => {
  let app: INestApplication;
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should deny access to unauthenticated users', async () => {
    const token = await request(app.getHttpServer())
      .post('auth/signin')
      .send({
        email: 'admin@gmail.com',
        password: 'password',
      })
      .expect(200)

    const response = await request(app.getHttpServer())
      .get('users')
      .set('Authorization', `Bearer ${token.body.data.access_token}`)
      .expect(200)

    expect(response).toEqual('This action returns all users');
  });
});
