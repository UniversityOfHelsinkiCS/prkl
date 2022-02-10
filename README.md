# Assembler

Assembler is a tool for automating division of students into project groups. It goes by the nickname "prkl" which is shorthand for _Projektiryhmäytymistyökalu_. More comprehensive description [here](documentation/introduction.md).

|Branch|CI Status|
|---|---|
|`master`|[![CircleCI](https://circleci.com/gh/UniversityOfHelsinkiCS/prkl/tree/master.svg?style=svg)](https://circleci.com/gh/UniversityOfHelsinkiCS/prkl/tree/master)|
|`trunk`|[![CircleCI](https://circleci.com/gh/UniversityOfHelsinkiCS/prkl/tree/trunk.svg?style=svg)](https://circleci.com/gh/UniversityOfHelsinkiCS/prkl/tree/trunk)|

### GitHub Actions status:
|Branch|Test status|
|---|---|
|`trunk`|[![Docker Image CI](https://github.com/UniversityOfHelsinkiCS/prkl/actions/workflows/docker-compose-tests.yml/badge.svg)](https://github.com/UniversityOfHelsinkiCS/prkl/actions/workflows/docker-compose-tests.yml)|

### Documentation:

Basic documentation is listed here. If you are member of development group in _Ohjelmistotuotantoprojekti_-course, you might be interested in more "beginner-friendly" explanation in [wiki](https://github.com/UniversityOfHelsinkiCS/prkl/wiki) (in Finnish).

- [Algorithm](documentation/algorithm/algorithm.md)
- [Client](documentation/client.md)
- [Database](documentation/structure/database_diagram.svg)
- [Migrations](documentation/migrations.md)
- [Server](documentation/server.md)
- [Middlewares](documentation/middlewares.md)
- [User roles](documentation/user_roles.md)


#### Structure

A descriptive graph of the frontend structure can be found [here](documentation/structure/structureFrontend.svg)

A similar graph for the backend structure can be found [here](documentation/structure/structureBackend.svg)

## Usage

Assembler uses `npm` to configure scripts, including `docker-compose` commands for development and testing. The commands outlined in this section should be run at project root unless preceded with a `cd` command and the directory where the related `package.json` is located.

### Setup

A little `Getting started` -guide can be found [here](documentation/setup.md)

### Development

Hot-loading of changes works currently only separately with backend and frontend. I.e., if you are running the backend in development mode, changes in the frontend are not loaded.

First start the backend server in development mode:

```bash
npm run dev
```

If setting up the development environment for the first time, or if the database is empty for any reason, seed the database by visiting:

```
http://localhost:3001/seed
```

And follow with launching the frontend with CRA's standard development server:

```bash
cd client/
npm start
```

NPM configuration is stored separately for frontend and backend in `client/` and `server/`, respectively. If you want to use `npm` directly, `cd` into these folders. You will need to provide the database service yourself and probably tinker with the configuration if you do not want use Docker.

### Tests

Cypress is used for end-to-end tests. **Deployment should always be conditional on all tests passing.**

To use cypress locally, launch Assembler in development mode as outlined above. Then do:

```bash
cd e2e/
npm run test:dev
```

This command configures Cypress and our tests to use different URL's for client and server requests, enabling you to take advantage of hotloading on both sides of the stack when writing tests. It is recommended that you have Cypress installed globally (`npm i -g cypress`) for local development.

### Backend unit tests

The server has unit tests written with Jest. You can run them with `cd server` and `npm run start:test`

#### Run all tests in containers (like they are run on CI)

```bash
npm test
```

### Miscellaneous Commands

Most of the commands defined in various `package.json` files accross the project are meant to be run through Docker. However, here are some you may find useful to run manually:

#### Build frontend and copy to server directory

```bash
npm run build:client
```

## Product backlog

The product backlog can be found [here](https://github.com/UniversityOfHelsinkiCS/prkl/projects/1). 

Previous teams have composed these lists of [unfinished tasks](documentation/unfinished.md) and [known issues](documentation/knownIssues.md). 

## Working hours log

[![Working hours log](https://docs.google.com/spreadsheets/d/e/2PACX-1vQRwia3ZLhC4J046vuJhMoKXh6w4IL-4fMTSHe6KPpdE6ZcXQZ4RUbkcivK4aHKZ4X7QFYGH39PchOu/pubchart?oid=1214125970&format=image)](https://docs.google.com/spreadsheets/d/1lHQkXljYu6rwUU9aYqCAmCOKvt7ys9mvTZlw7vPWSDU/edit#gid=587171835)

## Metrics
![Item count table](https://docs.google.com/spreadsheets/d/e/2PACX-1vQRwia3ZLhC4J046vuJhMoKXh6w4IL-4fMTSHe6KPpdE6ZcXQZ4RUbkcivK4aHKZ4X7QFYGH39PchOu/pubchart?oid=1248091356&format=image)

![Lead time and cycle time table](https://docs.google.com/spreadsheets/d/e/2PACX-1vQRwia3ZLhC4J046vuJhMoKXh6w4IL-4fMTSHe6KPpdE6ZcXQZ4RUbkcivK4aHKZ4X7QFYGH39PchOu/pubchart?oid=215978432&format=image)

![Cumulative flow diagram](https://docs.google.com/spreadsheets/d/e/2PACX-1vQRwia3ZLhC4J046vuJhMoKXh6w4IL-4fMTSHe6KPpdE6ZcXQZ4RUbkcivK4aHKZ4X7QFYGH39PchOu/pubchart?oid=188702353&format=image)



![Lead time histogram](https://docs.google.com/spreadsheets/d/e/2PACX-1vQRwia3ZLhC4J046vuJhMoKXh6w4IL-4fMTSHe6KPpdE6ZcXQZ4RUbkcivK4aHKZ4X7QFYGH39PchOu/pubchart?oid=445390584&format=image)


![Cycle time histogram](https://docs.google.com/spreadsheets/d/e/2PACX-1vQRwia3ZLhC4J046vuJhMoKXh6w4IL-4fMTSHe6KPpdE6ZcXQZ4RUbkcivK4aHKZ4X7QFYGH39PchOu/pubchart?oid=111466189&format=image)



