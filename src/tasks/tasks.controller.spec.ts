import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../src/auth/auth.guard';
import { AuthModule } from '../../src/auth/auth.module';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('TasksController', () => {
  let controller: TasksController;
  let app: INestApplication

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
      imports: [AuthModule, PrismaModule]
    }).overrideProvider(APP_GUARD).useClass(AuthGuard).compile();

    controller = module.get<TasksController>(TasksController);

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('/GET tasks unauthorize', async () => {
    return request(app.getHttpServer()).get('/tasks').expect(401);
  });

  it('/GET tasks authorize', async () => {
    const token = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'admin@gmail.com',
        password: 'password',
      })
      .then((res) => res.body.data.access_token);
      
    return request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  })

  it('/GET tasks access deny', async () => {
    const token = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'employee@gmail.com',
        password: 'password',
      })
      .then((res) => res.body.data.access_token);
      
    return request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  })

  it('/POST tasks unauthorize', async () => {
    return request(app.getHttpServer()).post('/tasks').expect(401);
  })

  it('/POST tasks authorize', async () => {
    const token = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'manager@gmail.com',
        password: 'password',
      })
      .then((res) => res.body.data.access_token);
      
    return request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
  })

  it('/POST tasks access deny', async () => {
    const token = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'employee@gmail.com',
        password: 'password',
      })
      .then((res) => res.body.data.access_token);
      
    return request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  })

  afterAll(async () => {
    await app.close();
  });
});
