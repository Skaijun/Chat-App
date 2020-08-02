const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

const app = express();
const serv = http.createServer(app);

const publicDirPath = path.join(__dirname, "../public");
app.use(express.static(publicDirPath));

const io = socketio(serv);
// ----------
io.on("connection", (socket) => {
  socket.emit("message", generateMessage("Welcome!"));
  socket.broadcast.emit("message", generateMessage("A new user has joined!"));

  socket.on("sendMsg", (msg, cb) => {
    io.emit("message", generateMessage(msg));
    cb();
  });

  socket.on("sendLocation", (location, cb) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${location.latitude},${location.longitude}`
      )
    );
    cb();
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("User has left the channel.."));
  });
});
// ----------

const port = process.env.PORT || 3000;
serv.listen(port, () => console.log(`Serv is up on port ${port}`));
