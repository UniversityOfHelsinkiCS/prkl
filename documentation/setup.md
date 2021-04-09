# Getting started

1. To make this project work in your device, you first need to `git clone` it into your directory.


2. After that you need to install all the dependencies from their respective `package.json` -files:
    - Run `npm install` in root, `/client`, `/server` and `/e2e`
    - During installing, you have a great opportunity to check out the folders' `README` for more specific information.
      - [Client](../client/README.md)
      - [Server](../server/README.md)


3. This project uses Docker. If you've already installed and used Docker before, great! If not, don't worry - you will just have to install:
    - Docker (engine)
    - Docker Compose
      - I highly recommend reading these useful links:
        - [DevOps with Docker, part 0](https://devopswithdocker.com/part0/)
        - [Docker Docs, install Docker Compose](https://docs.docker.com/compose/install/)


4. Try running `npm run dev` inside root & `npm start` inside `/client`. If there are no errors in terminals, awesome! The UI should now be visible in the browser (quite empty though).


5. Keep the backend running and seed the database by visiting `localhost:3001/seed` so that the rest of functionalities (including template data) are visible during startup.
    - For more realistic template data, try [this](data.md).
  
