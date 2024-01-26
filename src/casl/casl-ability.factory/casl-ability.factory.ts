import { InferSubjects, Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Action } from "src/enums/action.enum";

type Subjects = InferSubjects<typeof Prisma.RoleInput | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.isAdmin) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      can(Action.Read, 'all'); // read-only access to everything
    }

    can(Action.Update, Prisma., { authorId: user.id });
    cannot(Action.Delete, Prisma., { isPublished: true });

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}