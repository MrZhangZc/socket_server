const redis = require('../util/redis')
const Chat = require("../model/chat");
const { Chat_List } = require('../util/key')
// 当前在线人数
let count = 0;
// 总访客人数
let totalCount = 0;

const socketServer = server => {
  const io = require('socket.io')(server);
  io.on('connection', (socket) => {
    console.log("当前有用户连接");
    let name = ''
    totalCount++;

    // 加入群聊
    socket.on("join", async function(message) {
      const res = await redis.hexists(Chat_List, socket.id)
      if(!res) count++;
      name = message.name;
      console.log('加入群聊：', name)
      await redis.hset(Chat_List, socket.id, JSON.stringify({name, avatar: message.avatar}))
      const list = await redis.hgetall(Chat_List)
      socket.broadcast.emit("joinNoticeOther", {
        name: name,
        action: "加入了群聊",
        count: count,
        onLineList: list
      });
      socket.emit("joinNoticeSelf", {
        onLineList: list,
        count: count,
      });
    });

    // 断开连接
    socket.on("disconnect", async function() {
      const res = await redis.hexists(Chat_List, socket.id)
      if(res) {
        await redis.hdel(Chat_List, socket.id)
        count--
        const list = await redis.hgetall(Chat_List)
        console.log('离开群聊：', name)
        socket.broadcast.emit("joinNoticeOther", {
          name: name,
          action: "离开了群聊",
          count: count,
          onLineList: list
        });
      }
    });

    socket.on('sendGroupMsg', data => {
      console.log('收到消息', data)
      socket.broadcast.emit("receiveGroupMsg", data);
      let chatMessage = new Chat(data);

      chatMessage.save();
    })

    //Someone is typing
    socket.on("typing", data => {
      socket.broadcast.emit("notifyTyping", {
        user: data.user,
        message: data.message
      });
    });

    socket.on("stopTyping", () => {
      socket.broadcast.emit("notifyStopTyping");
    });
  });
}

module.exports = {
  socketServer
}