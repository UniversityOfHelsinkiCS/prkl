# PRKL

PRKL is a tool for automating division of students into project groups. The name is shorthand for _Projektiryhmäytymistyökalu_.

## Usage

### Development Mode

Hot-loading of changes works currently only separately with backend and frontend. I.e., if you are running the backend in development mode, changes in the frontend are not loaded.

It is recommended to use Docker containers for development. To launch a container in development mode, do (in project root):

```bash
docker-compose up
```

NPM configuration is stored separately for frontend and backend in `client/` and `server/`, respectively. If you want to use `npm` directly, `cd` into these folders.
