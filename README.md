# Assembler

Assembler is a tool for automating division of students into project groups. It goes by the nickname "prkl" which is shorthand for _Projektiryhmäytymistyökalu_. More comprehensive description [here](documentation/introduction.md).

| Branch   | CI Status                                                                                                                                                                                                                         |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `master` | [![CI/CD Pipeline](https://github.com/UniversityOfHelsinkiCS/prkl/actions/workflows/docker-compose-tests.yml/badge.svg?branch=master)](https://github.com/UniversityOfHelsinkiCS/prkl/actions/workflows/docker-compose-tests.yml) |
| `trunk`  | [![CI/CD Pipeline](https://github.com/UniversityOfHelsinkiCS/prkl/actions/workflows/docker-compose-tests.yml/badge.svg?branch=trunk)](https://github.com/UniversityOfHelsinkiCS/prkl/actions/workflows/docker-compose-tests.yml)  |

## Documentation:

Basic documentation is listed here. If you are member of development group in _Ohjelmistotuotantoprojekti_-course, you might be interested in more "beginner-friendly" explanation in [wiki](https://github.com/UniversityOfHelsinkiCS/prkl/wiki) (in Finnish).

- [Algorithm](documentation/algorithm/algorithm.md)
- [Client](documentation/client.md)
- [Database](documentation/structure/database_diagram.svg)
- [Migrations](documentation/migrations.md)
- [Server](documentation/server.md)
- [Middlewares](documentation/middlewares.md)
- [User roles](documentation/user_roles.md)

### Structure

A descriptive graph of the frontend structure can be found [here](documentation/structure/structureFrontend.svg)

A similar graph for the backend structure can be found [here](documentation/structure/structureBackend.svg)

### Setup

A little `Getting started` -guide can be found [here](documentation/setup.md)

## Development

Docker-compose is used the run the app in development mode on your computer. First make sure docker and docker-compose are installed on your computer. Then the development environment can be started using

```
docker-compose up
```

This starts the client, graphQl server, database and adminer service in their own containers. Use `docker ps` to list all running containers and `docker-compose down` to stop them.

A graphQl endpoint can be found at http://localhost:3001/grapgql.

The server restarts automatically after changes to the source code. The server also contains a production version of the client but it's not hot-loadable so it is more convenient to use the hot-loadable development front end at http://localhost:3000.

The local Postgres database starts in it's own container and it can easily be accessed using Adminer at http://localhost:3003 (System: PostgreSQL, Server: db, Username: postgres, Password: postgres, Database: postgres).

Note to Windows users: Hot loading changes in the front end and back end may not work as intended on a Windows machine while using docker-compose. One solution is to run the project on WSL (Windows Subsystem for Linux). Another way is to use docker-compose only to start the database and adminer (`docker-compose up adminer db`) while starting the client and server manually. In this case start the client in the client folder with `npm start` and the server in the server folder with `npm run start:dev`.

## Installing dependencies

The node_modules folders in both the frontend and backend are shared between the Docker container and development computer using Docker volumes. To ensure a consistent development environment it is adviced to install dependencies from inside the container and then mirror them to the outside. The reason is, that things like the npm version or the operating system can affect what actual node_modules are installed. Installing dependencies from inside the container can be achieved using the following steps:

1. When in the /client or /server folder, install the dependency using `npm install` on your development computer like you normally would.
2. Delete the node_modules folder
3. Start the development environment using `docker-compose up --build`

When the container starts up, it checks if a node_modules folder is present. If it's missing it installs the modules. After the install, the new node_modules folder will appear on the development computer as well.

If someone else has installed new dependencies (for example you see changes in package.json or package.lock.json after pulling a new version): Delete the node_modules folder and have the new dependencies installed automatically by using `docker-compose up --build`.

## End to end tests

Cypress is used for end-to-end tests. It is recommended to have Cypress installed globally (`npm i -g cypress`). To use cypress, first launch Assembler in development mode as outlined above. Then do:

```
cd e2e
npm install
npm run test:dev
```

To run all tests in headless mode like they are run in CI

```
docker-compose -f docker-compose.ci.yml run tests
```

The development app needs to be close for this in order to avoid port conflicts. Also if docker-compose runs as root you may need `sudo chown -R $USER:$USER pg_data`.

## Backend unit tests

The server has unit tests written with Jest. You can run them with

```
cd server
npm run start:test`
```

## Product backlog

The product backlog can be found [here](https://github.com/UniversityOfHelsinkiCS/prkl/projects/1).

Previous teams have composed these lists of [unfinished tasks](documentation/unfinished.md) and [known issues](documentation/knownIssues.md).

## Working hours log spring 2022

[![Working hours log](https://docs.google.com/spreadsheets/d/e/2PACX-1vQRwia3ZLhC4J046vuJhMoKXh6w4IL-4fMTSHe6KPpdE6ZcXQZ4RUbkcivK4aHKZ4X7QFYGH39PchOu/pubchart?oid=1214125970&format=image)](https://docs.google.com/spreadsheets/d/1lHQkXljYu6rwUU9aYqCAmCOKvt7ys9mvTZlw7vPWSDU/edit#gid=587171835)

## Metrics spring 2022

See the separate [metrics document](metriikat.md) for metrics and charts.
