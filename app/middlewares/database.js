const mongoose = require('mongoose');
const { resolve } = require('path');
const glob = require('glob');

glob.sync(resolve(__dirname, '../model', './*.js')).map(require);
const database = app => {
  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
  }
  mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

  mongoose.connection.on('disconnected', () => {
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  })

  mongoose.connection.on('error', err => {
    console.log('mongodb连接失败', err.message);
  })

  mongoose.connection.on('open', async ()=> {
    console.log('成功连接mongodb数据库', process.env.MONGO_URL);
  })
}

module.exports = {
  database
}
