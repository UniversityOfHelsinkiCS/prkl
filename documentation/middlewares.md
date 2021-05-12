# Middlewares

In production all the traffic goes through Shibboleth and headers are added for authorization. When server is responding to client, some headers are removed (*this is why logout url needs to be dug out on the server side*).

## authorization

Authorization middleware is only used in production environment and otherwise skipped. Typescript is used to add custom property ```user``` to the requests based on the Shibboleth-headers.

## loggedInAs

When not in production, the ```user``` property is added in this middleware by admin mocking themselves.

Based on the request header ```x-admin-logged-in-as``` this middleware overwrites ```user``` property and adds the actual users' username as a custom property ```mockedBy``` to the request. It also stores both usernames into an object as a Key: Value pair (*"mini database"*).

Reloading a page re-initializes the mocking ```Store``` in frontend, so client is forced to wait until this info is retrieved from the middleware before rendering. There is a server endpoint ```/mocking``` for this purpose.
