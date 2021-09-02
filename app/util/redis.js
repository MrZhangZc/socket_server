const Redis = require('ioredis');

const redisClirnt = new Redis({
  host: process.env.REDIS_SERVER_HOST,
  port: process.env.REDIS_SERVER_POST,
  db: process.env.REDIS_SERVER_DB,
  password: process.env.REDIS_AUTH
})

module.exports = redisClirnt