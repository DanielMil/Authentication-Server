# Simple Authentication Service

> Containerized authentication server intended to bootstrap the authentication process for small apps. This app can handle common authentication routes and user sessions. The intention is for this service to be easy to configure and run, and as a starting point for most projects.

> The service currently uses Passport.js with MongoDB, but there are plans to implement a SQL configuration in the near future.

## Installation

####  You must have Docker installed on your machine. 

### Clone

- Clone this repo to your local machine using `https://github.com/DanielMilGuelph/Authentication-Server`

### Configure

> Create a .env file for your configurations in the root directory.

```INI
MONGO_URI = mongodb://mongo:27017:27017/<database name>
```
### Build and Run
```shell
docker-compose up build
```
---

## Features
- [x] Endpoints to login, register, logout and get current user in session.
- [x] Containerized and exposed with Docker.
- [x] Support user sessions with cookies.
- [ ] JWT Support.
- [ ] Database configuration between MongoDB and SQL using Sequelize.
- [ ] Option for TLS/SSL encryped https routes through config.
- [ ] Swagger?
- [ ] Endpoints for updating user, deleting user and forgotten passwords.
