const { Wechaty } = require("wechaty");
const { ScanStatus } = require("wechaty-puppet");
const QrcodeTerminal = require("qrcode-terminal");
const RoomFile = require("./RoomFile");
const news = require("./news");

const roomFile = new RoomFile();

const bot = new Wechaty();

bot.on("scan", (qrcode, status) => {
  if (status === ScanStatus.Waiting) {
    QrcodeTerminal.generate(qrcode, {
      small: true,
    });
  }
});

bot.on("login", async (user) => {
  console.log(`User ${user} logged in`);
});

bot.on("message", async (msg) => {
  const contact = msg.from();
  const text = msg.text();
  const room = msg.room();
  if (room) {
    const topic = await room.topic();
    if (text === "订阅") {
      console.log(`Room: ${topic} Contact: ${contact.name()} Text: ${text}`);
      roomFile.subscript(topic);
    } else if (text === "取消订阅") {
      console.log(`Room: ${topic} Contact: ${contact.name()} Text: ${text}`);
      roomFile.unsubcript(topic);
    }
  } else {
    console.log(`Contact: ${contact.name()} Text: ${text}`);
  }
});

bot.start();

setInterval(async () => {
  const rooms = [];
  for (const name of Object.keys(roomFile.rooms)) {
    const room = await bot.Room.find({ topic: name });
    if (room) rooms.push(room);
  }
  news.cailian(rooms);
  news.tonghuashun(rooms);
}, 5000);
