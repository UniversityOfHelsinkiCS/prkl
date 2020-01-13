# Toskaboiler

Toskaboiler is a boilerplate for anyone wanting to get a kickstart on mono-repo react - fullstack project. It contains all the parts that are common in toska projects.

## Short tutorial

The project is split into 2 parts: client and server while index.js in root works as the main file. The project contains no database dependant parts.

### ApiConnection

ApiConnection is a custom redux middleware that is used in most toska software. It is used to simplify redux usage by wrapping axios.

You can see redux example using apiConnection in client/components/MessageComponent. 

## How users can get started with Toskaboiler

Clone the repo, install node and run `npm install` to get started!

`npm start`
To start the project in production mode use this command. It builds the client and then the server.

`npm run dev`
To start the project in development mode use this command. It will start the server in hotloading mode.

`npm run lint`
To clean all the little style flaws around your code.

`npm run stats`
To create statistics on how big your project is.

Please note that npm test doesn't do anything, this is intentional: testing framework is all up to you. I recommend looking into jest, ava and/or superbara.

## Issues with Toskaboiler

Send an issue if you find mistakes, problems or something to improve in Toskaboiler.
Feel free to create a pull request.

## Maintainers and Contribution

Toska of course.

University of Helsinki.