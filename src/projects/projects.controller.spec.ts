import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../src/auth/auth.guard';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../../src/auth/auth.module';
import { PrismaModule } from '../../src/prisma/prisma.module';

describe('ProjectsController', () => {
  let app: INestApplication;
  let controller: ProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [ProjectsService],
      imports: [AuthModule, PrismaModule]
    })
      .overrideProvider(APP_GUARD)
      .useClass(AuthGuard)
      .compile();

    controller = module.get<ProjectsController>(ProjectsController);

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('/GET projects unauthorize', async () => {
    return request(app.getHttpServer()).get('/projects').expect(401);
  });

  it('/GET projects authorize', async () => {
    const token = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'admin@gmail.com',
        password: 'password',
      })
      .then((res) => res.body.data.access_token);
      
    return request(app.getHttpServer())
      .get('/projects')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  })

  it('/GET projects access deny', async () => {
    const token = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'employee@gmail.com',
        password: 'password',
      })
      .then((res) => res.body.data.access_token);
      
    return request(app.getHttpServer())
      .get('/projects')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  })

  it('/POST projects unauthorize', async () => {
    return request(app.getHttpServer()).post('/projects').expect(401);
  })

  it('/POST projects authorize', async () => {
    const token = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'admin@gmail.com',
        password: 'password',
      })
      .then((res) => res.body.data.access_token);
      
    return request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
  })

  it('/POST projects access deny', async () => {
    const token = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'employee@gmail.com',
        password: 'password',
      })
      .then((res) => res.body.data.access_token);
      
    return request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  })

  afterAll(async () => {
    await app.close();
  });
});
