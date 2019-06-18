# Simple Authentication Service

> This application is intended to be a bootstrap or proof of concept for designing a containerized authentication microservice. The server is easy to run and configure, and currently supports user registration, login, sessions, password recovery and JWT. 

## Installation 

#### Clone

- Clone this repo to your local machine using `https://github.com/DanielMil/Authentication-Server`

#### Configure

> Create a .env file for your configurations in the root directory. Copy the following configuration and edit appropriately.

```INI
# MongoDB connection
MONGO_URI = mongodb://mongo:27017/<database>

# Email credentials for forgotten password email reset
EMAIL_ADDRESS = <email> 
EMAIL_PASSWORD = <password>

# Secrets for JWT and Express-Session.
# Secrets should be a random, private string.
JWT_SECRET = <secret>
SESSION_SECRET = <secret>
```

### With Docker (Recommended)

#### Build and Run
```shell
docker-compose up --build
```

### Manually

> Ensure that TypeScript, Node.js, tsc and MongoDB are installed on your machine.

#### Install dependencies.
```shell
npm install
```

#### Compile the TypeScript into JavaScript.
```shell
tsc
```

#### Start your Mongo database with any method you wish.

#### Run the server.
```shell
npm start
```

```shell
npm run dev # Runs server with nodemon
```
---

## Features
- [x] Endpoints to login, register, logout and get current user in session.
- [x] Containerized and exposed with Docker.
- [x] Support user sessions with cookies.
- [x] JWT Support.
- [x] Endpoints for updating user, deleting user and forgotten passwords.
