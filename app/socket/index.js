const socketServer = server => {
  const io = require('socket.io')(server);
  io.on('connection', (socket) => {
    socket.on("disconnect", function() {
      console.log("user disconnected");
    });

    //Someone is typing
    socket.on("typing", data => {
      socket.broadcast.emit("notifyTyping", {
        user: data.user,
        message: data.message
      });
    });

    // 给客户端发送消息
    socket.emit('welcome','欢迎连接sockeiiiiiooooo')
      
    // 监听客户端消息
    socket.on('hello', data => {
      console.log('接收客户端发送数据', data)
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