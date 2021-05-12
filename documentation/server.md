**Server-Side**

The current setup we have in place is quite frankly, dumb. The application has two separate ways of “ensuring” the data is structured. One or the other should suffice, and installing a nosql database could rid the backend of some of its cumbersomeness.

Currently, we have three services running in separate containers. The services are postgreSQL database, the backend server, and adminer service. Postgres is running on port 5432, backend on 3001 and adminer on 3003. Postgres has all default credentials, ‘postgres’. 

In development mode, 3001/graphql has graphiql running for testing queries locally.
