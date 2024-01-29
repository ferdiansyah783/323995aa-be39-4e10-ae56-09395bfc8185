## Build Docker
```bash
$ docker-compose up
```

## Installation

```bash
$ yarn install
```

## Running migration
```bash
$ npx prisma migrate dev

# seeding
$ npx prisma db seed
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

# RBAC Permissions

Here are the permission rules for each role in the system

### Super Admin

* Can access full functionalities
* Can manage projects
* Can manage tasks
* Can manage users

### Admin

* Can manage projects
* Can assign project to managers
* Can view all users

### Manager

* Can manage tasks
* Can assign task to employees
* Can view all users

### Employee

* Can view all tasks
* Can view all projects of him
