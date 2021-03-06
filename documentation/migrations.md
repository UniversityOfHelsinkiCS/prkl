# Migrations

Migration functionality is provided by `typeorm` and runs always on backend start-up. See [TypeORM Documentation - Migrations](https://typeorm.io/#/migrations) for more information.

## Migration Files

## Auto-Generation

Migrations can be autogenerated with TypeORM CLI tool. This must be done against a current database, and so it is recommended to do it inside a running Docker container.

To begin, start the server in development mode (from the root of the project):

```bash
npm run dev
```

Then launch a shell inside the running container:

```bash
docker exec -ti prkl-dev /bin/bash
```

Make sure you are at `/usr/src/app/server` and generate the migrations, replacing `<NAME>` with a descriptive name for the migration:

```bash
npx ts-node node_modules/typeorm/cli.js migration:generate -n <NAME>
```

If successful, the new migration file will be placed at the root of `/server/` directory. Move it to `/server/src/migrations` directory where migration files are stored in! Then restart the server to apply the migration.


**Remember to double-check your migrations before committing - undoing them can be a real PITA!**
