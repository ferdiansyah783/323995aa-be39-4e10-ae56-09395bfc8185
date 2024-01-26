import { Prisma, PrismaClient } from '@prisma/client';

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

  let users: Prisma.UserCreateInput[] = [
    {
      name: 'super_admin',
      email: 'superadmin@gmail.com',
      password: '$2b$10$yZbnRqDfD06CEU9/Lg2FkeD3/mT891WjAS1Q9wYhhhByv43Wp2YR6',
      role: {
        connect: {
          name: 'super_admin',
        },
      },
    },
    {
      name: 'admin',
      email: 'admin@gmail.com',
      password: '$2b$10$yZbnRqDfD06CEU9/Lg2FkeD3/mT891WjAS1Q9wYhhhByv43Wp2YR6',
      role: {
        connect: {
          name: 'admin',
        },
      },
    },
    {
      name: 'manager',
      email: 'manager@gmail.com',
      password: '$2b$10$yZbnRqDfD06CEU9/Lg2FkeD3/mT891WjAS1Q9wYhhhByv43Wp2YR6',
      role: {
        connect: {
          name: 'manager',
        },
      },
    },
    {
      name: 'employee',
      email: 'employee@gmail.com',
      password: '$2b$10$yZbnRqDfD06CEU9/Lg2FkeD3/mT891WjAS1Q9wYhhhByv43Wp2YR6',
      role: {
        connect: {
          name: 'employee',
        },
      },
    },
  ];

  const createdUsers = await Promise.all(
    users.map(async (user) => {
      return await prisma.user.create({
        data: user,
      });
    }),
  );

  console.log({ createdRoles, createdUsers });
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
