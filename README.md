# Meanstack project - Login System

    meanstack project with jade template engine
    restAPI for users (register/login/logout/delete/reset password)
    authentication with passport and jwt, using interceptors


# MEAN MongoDb Express AngularJS NodeJS Project

--------
## Objectives

MongoDb Express AngularJs NodeJS Project (MEAN)
 - authentication system
 - mongoDb using mongoose
 - Express version should be at least 4.1
 - restricted access for logged in user
 - non logged in users can access only basic pages
 - CRUD provided for users and customers


#### Structure
-------------------------
access.log
app.js
env.sample.json (rename it to env.json and fill your own credentials)
Makefile
package.json
README.md

    ./bin:
         www

    ./client:

        components
            dashboard
            home
            users
        shared
            error
            menu
            interceptor.service.js
        modules
        main.js

    ./public:

        fonts
        images
        javascripts
        stylesheets

    ./server:
        api
        config
        models
        routes
        util
    ./views:
        users
        includes
        partials
        emailTemplates


### Final package.json:
```sh
{
  "name": "TeamCo",
  "version": "1.0",
  "author": "Tereza Simcic",
  "homepage": "http://tesispro.net",
  "private": true,
  "description": "mean stack application with jade template engine", authentication with passport and jwt"
  "scripts": {
    "start": "node_modules/.bin/supervisor ./bin/www",
    "test": "make test"
  },
  "dependencies": {
    "express": "~4.13.4",
    "static-favicon": "^1.0.0",
    "morgan": "^1.0.0",
    "cookie-parser": "^1.0.1",
    "body-parser": "^1.0.0",
    "debug": "^0.7.4",
    "jade": "^1.3.0",
    "mongodb": "^2.1.18",
    "mongoose": "^4.4.20",
    "supervisor": "^0.11.0",
    "passport": "^0.2.1",
    "passport-local": "^1.0.0",
    "passport-local-mongoose": "^1.0.0",
    "jsonwebtoken": "^7.0.1",
    "nodemailer": "^2.4.2",
    "activator": "^2.3.0"
  },
  "devDependencies": {
    "mocha": "^2.5.3 ",
    "should": "^9.0.2",
    "superagent": "^1.8.3"
  }
}
```

### Usage

**1 rename env.sample.json to env.json and add your credentials / preferences**

**2 install node modules**

```sh
npm install
```
**3 install bower if it is not already installed
```sh
sudo npm install bower -g
```
.bowerrc is provided and will install a frontend packages into
**public/js folder**


**install angular**
```sh
bower install angular
bower install angular-routes
```

(for now all needed packages are installed)

**4 run the project**

```sh
npm start
```

### Tests
- create new folder test
- add tests
- provided Makefile script for tests, run:

```sh
test
```

