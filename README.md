# Assembler

Assembler is a tool for automating division of students into project groups. It goes by the nickname "prkl" which is shorthand for _Projektiryhmäytymistyökalu_.

|Branch|CI Status|
|---|---|
|`master`|[![CircleCI](https://circleci.com/gh/UniversityOfHelsinkiCS/prkl/tree/master.svg?style=svg)](https://circleci.com/gh/UniversityOfHelsinkiCS/prkl/tree/master)|
|`trunk`|[![CircleCI](https://circleci.com/gh/UniversityOfHelsinkiCS/prkl/tree/trunk.svg?style=svg)](https://circleci.com/gh/UniversityOfHelsinkiCS/prkl/tree/trunk)|

### Documentation:

- [Migrations](documentation/migrations.md)

## Usage

### Development

Hot-loading of changes works currently only separately with backend and frontend. I.e., if you are running the backend in development mode, changes in the frontend are not loaded.

First start the backend server in development mode:

```bash
npm run dev
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

### Miscellaneous Commands

Most of the commands defined in various `package.json` files accross the project are meant to be run through Docker. However, here are some you may find useful to run manually:

#### Build frontend and copy to server directory

```bash
npm run build:client
```
