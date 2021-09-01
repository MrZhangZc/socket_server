if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const Koa = require('koa');
const app = new Koa();
const R = require('ramda');
const server = require('http').createServer(app.callback());

const { resolve } = require('path');
const r = path => resolve(__dirname, path);
require('./app/socket').socketServer(server)

const MIDDLEWARES = ['database'];

const useMiddleWares = app => {
  return R.map(R.compose(
    R.map(i => i(app)),
    require,
    i => `${r('./app/middlewares')}/${i}`
  ))
}
useMiddleWares(app)(MIDDLEWARES);

server.listen(process.env.PORT, () => console.log(`Server Start at ${process.env.PORT}`))