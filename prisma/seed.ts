import { Prisma, PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/auth/hash_password';

const prisma = new PrismaClient();

async function main() {
  let roles: Prisma.RoleCreateInput[] = [
    {
      name: 'super_admin',
    },
    {
      name: 'admin',
    },
    {
      name: 'manager',
    },
    {
      name: 'employee',
    },
  ];

  const createdRoles = await Promise.all(
    roles.map(async (role) => {
      return await prisma.role.create({
        data: role,
      });
    }),
  );

  let permissions: Prisma.PermissionCreateInput[] = [
    {
      action: 'manage',
      subject: 'Project',
      role: {
        connect: {
          name: 'super_admin',
        },
      },
    },
    {
      action: 'manage',
      subject: 'Task',
      role: {
        connect: {
          name: 'super_admin',
        },
      },
    },
    {
      action: 'manage',
      subject: 'User',
      role: {
        connect: {
          name: 'super_admin',
        },
      },
    },
    {
      action: 'manage',
      subject: 'Project',
      role: {
        connect: {
          name: 'admin',
        },
      },
    },
    {
      action: 'read',
      subject: 'Task',
      role: {
        connect: {
          name: 'admin',
        },
      },
    },
    {
      action: 'read',
      subject: 'User',
      role: {
        connect: {
          name: 'admin',
        },
      },
    },
    {
      action: 'manage',
      subject: 'Task',
      role: {
        connect: {
          name: 'manager',
        },
      },
    },
    {
      action: 'read',
      subject: 'Project',
      role: {
        connect: {
          name: 'manager',
        },
      },
    },
    {
      action: 'read',
      subject: 'User',
      role: {
        connect: {
          name: 'manager',
        },
      },
    },
    {
      action: 'read',
      subject: 'Task',
      role: {
        connect: {
          name: 'employee',
        },
      },
    },
    {
      action: 'read',
      subject: 'Project',
      role: {
        connect: {
          name: 'employee',
        },
      },
    },
  ];

  const createdPermissions = await Promise.all(
    permissions.map(async (permission) => {
      return await prisma.permission.create({
        data: permission,
      });
    }),
  );

  let users: Prisma.UserCreateInput[] = [
    {
      name: 'super_admin',
      email: 'superadmin@gmail.com',
      password: 'password',
      salt: '25b14ce3-c506-42e3-a53b-a4cce190be32',
      role: {
        connect: {
          name: 'super_admin',
        },
      },
    },
    {
      name: 'admin',
      email: 'admin@gmail.com',
      password: 'password',
      salt: '9234c19a-219c-41d4-bcc5-42747c90a058',
      role: {
        connect: {
          name: 'admin',
        },
      },
    },
    {
      name: 'manager',
      email: 'manager@gmail.com',
      password: 'password',
      salt: 'abb90b2e-0afe-44e1-b24e-15327eb4fbce',
      role: {
        connect: {
          name: 'manager',
        },
      },
    },
    {
      name: 'employee',
      email: 'employee@gmail.com',
      password: 'password',
      salt: 'a827e119-34ff-4beb-9f0a-f8a2fdfc801b',
      role: {
        connect: {
          name: 'employee',
        },
      },
    },
  ];

  const createdUsers = await Promise.all(
    users.map(async (user) => {
      let passwordHash = await hashPassword(user.password, user.salt);
      return await prisma.user.create({
        data: {
          ...user,
          password: passwordHash,
        },
      });
    }),
  );

  console.log({ createdRoles, createdPermissions, createdUsers });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
