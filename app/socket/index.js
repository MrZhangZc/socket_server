const redis = require('../util/redis')
const Chat = require("../model/chat");
const { Chat_List } = require('../util/key')
// 当前在线人数
let count = 0;
// 总访客人数
let totalCount = 0;

let onLine = []

const socketServer = server => {
  const io = require('socket.io')(server);
  io.on('connection', (socket) => {
    console.log("当前有用户连接");
    let name = ''
    count++;
    totalCount++;
    console.log("count:" + count);

    socket.on("join", async function(message) {
      name = message.name;
      await redis.hset(Chat_List, socket.id, JSON.stringify({name, avatar: message.avatar}))
      console.log(name + "加入了群聊");
      onLine.push({
        name: name,
        avatar: message.avatar,
      })
      socket.broadcast.emit("joinNoticeOther", {
        name: name,
        avatar: message.avatar,
        action: "加入了群聊",
        count: count
      });
      const list = await redis.hgetall(Chat_List)
      socket.emit("joinNoticeSelf", {
        onLineList: list
      });
    });

    socket.on("disconnect", function() {
      redis.hdel(Chat_List, socket.id)
      count--
      // onLine = onLine.filter(item => )
      console.log("user disconnected", count);
    });

    //Someone is typing
    socket.on("typing", data => {
      socket.broadcast.emit("notifyTyping", {
        user: data.user,
        message: data.message
      });
    });

    socket.on("disconnectUser", function(message){
      console.log(message, '离开了')
    })

    // 给客户端发送消息
    socket.emit('welcome','欢迎连接sockeiiiiiooooo')
      
    // 监听客户端消息
    socket.on('hello', data => {
      console.log('接收客户端发送数据', data)
    })

    socket.on('sendGroupMsg', data => {
      console.log('收到消息', data)
      socket.broadcast.emit("receiveGroupMsg", data);
      let chatMessage = new Chat(data);

      chatMessage.save();
    })

    //when soemone stops typing
    socket.on("stopTyping", () => {
      socket.broadcast.emit("notifyStopTyping");
    });
  });
}

module.exports = {
  socketServer
}