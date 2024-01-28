import {
    ForbiddenError,
    ForcedSubject,
    MongoAbility,
    RawRuleOf,
    createMongoAbility,
    subject,
  } from '@casl/ability';
  import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { User } from '@prisma/client';
  import { FastifyRequest } from 'fastify';
  import { Observable } from 'rxjs';
  import {
    CHECK_ABILITY,
    RequiredRule,
  } from 'src/decorators/abilities.decorator';
  import { PrismaService } from 'src/prisma/prisma.service';
  
  export const actions = [
    'manage',
    'read',
    'create',
    'update',
    'delete',
  ] as const;
  export const subjects = ['Project', 'User', 'all'] as const;
  
  export type Abilities = [
    (typeof actions)[number],
    (
      | (typeof subjects)[number]
      | ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>
    ),
  ];
  
  export type AppAbility = MongoAbility<Abilities>;
  
  @Injectable()
  export class AbilitiesGuard implements CanActivate {
    constructor(
      private reflector: Reflector,
      private prismaService: PrismaService,
    ) {}
  
    createAbility = (rules: RawRuleOf<AppAbility>[]) =>
      createMongoAbility<AppAbility>(rules);
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const rules: any =
        this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
        [];
      const currentUser: User = context.switchToHttp().getRequest().user;
      const request: FastifyRequest = context.switchToHttp().getRequest();
  
      const userPermissions = await this.prismaService.permission.findMany({
        where: {
          roleId: currentUser.roleId,
        },
      });
  
      try {
        const ability = this.createAbility(Object(userPermissions));
  
        for await (const rule of rules) {
          let sub = {};
          ForbiddenError.from(ability)
            .setMessage('You are not allowed to perform this action')
            .throwUnlessCan(rule.actions, subject(rule.subject, sub));
        }
  
        return true;
      } catch (error) {
        if (error instanceof ForbiddenError) {
          throw new ForbiddenException(error.message);
        }
        throw error;
      }
    }
  }
  