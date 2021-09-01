const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    content: String,
    avatarUrl: String,
    date: String,
    from: String
  },
  {
    timestamps: true
  }
);

const Chat = mongoose.model("chat", chatSchema);

module.exports = Chat;