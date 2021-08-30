if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
require('./app/socket').socketServer(server)

server.listen(process.env.PORT, () => console.log(`Server Start at ${process.env.PORT}`))