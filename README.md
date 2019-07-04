# Instacart

Instacart is a NodeJS crawler for https://instacart.com

## Installation

[NodeJS](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/get-npm) are needed to run the script

```bash
git clone https://github.com/AlbertMaristany/instacart.git
npm i
node belvo.js
```

NOTE: Use [nodemon](https://www.npmjs.com/package/nodemon) on development to restart the server on change
Use a process manager like [PM2](http://pm2.keymetrics.io/) on production

## Usage

If you want to test the functionallity just tip:
```bash
npm run test
```

If you want to use the endpoints:
- http://localhost:3170/ping
- http://localhost:3170/store?email={yourEmail}&password={yourPassword}
- http://localhost:3170/store/items?email={yourEmail}&password={yourPassword}

## Documentation

To generate documentation install and run [apiDoc](http://apidocjs.com/)

```bash
npm i apidoc -g
npm run docs
```

Finally, navigate to http://localhost:3170/docs/