# Simple Authentication Service

> Containerized authentication server intended to bootstrap the authentication process for small apps, with the intention of easy to configure and run.

> The service currently uses Passport.js with MongoDB with plans to implement a SQL configuration in the near future.

## Installation

####  You must have Docker installed on your machine. 

### Clone

- Clone this repo to your local machine using `https://github.com/DanielMilGuelph/Authentication-Server`

### Configure

> Create a .env file for your configurations in the root directory.

```INI
MONGO_URI = mongodb://mongo:27017:27017/autocommitter
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
- [ ] Endpoint for updating user, deleting user and forgotten passwords.
