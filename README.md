## Modern JS API Server

_This project is based on Michael Herman's excellent article series on building a RESTful API with Koa, Postgres, and Sinon. [Check it out](https://mherman.org/blog/building-a-restful-api-with-koa-and-postgres/)_

### Getting Started
Clone this repo and install dependencies.

```text
$ git clone https://github.com/forksofpower/modern-js-server-example.git
$ npm install
```

### Project Structure
```text
.
├── knexfile.js
├── package.json
├── package-lock.json
├── README.md
├── src
│   └── server
│       ├── auth.js
│       ├── db
│       │   ├── connection.js
│       │   ├── migrations
│       │   │   ├── 20180919115702_movies.js
│       │   │   └── 20180924181822_users.js
│       │   ├── queries
│       │   │   ├── movies.js
│       │   │   └── users.js
│       │   └── seeds
│       │       ├── movies_seed.js
│       │       └── users.js
│       ├── index.js
│       ├── routes
│       │   ├── _helpers.js
│       │   ├── auth.js
│       │   ├── index.js
│       │   └── movies.js
│       ├── session.js
│       └── views
│           ├── admin.html
│           ├── login.html
│           ├── register.html
│           └── status.html
└── test
    ├── integration
    │   ├── routes.auth.stub.test.js
    │   ├── routes.auth.test.js
    │   ├── routes.index.test.js
    │   └── routes.movies.test.js
    └── unit
        └── sample.test.js
```
