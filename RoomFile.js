const fs = require("fs");
const path = require("path");

const fileName = "room.json";
const filePath = path.join(__dirname, fileName);

function RoomFile() {
  this.rooms = {};
  if (fs.existsSync(filePath)) {
    this.rooms = JSON.parse(fs.readFileSync(filePath));
  }
}

RoomFile.prototype.syncFile = function () {
  fs.writeFileSync(filePath, JSON.stringify(this.rooms));
};

RoomFile.prototype.subscript = function (room) {
  this.rooms[room] = Date.now();
  this.syncFile();
};

RoomFile.prototype.unsubcript = function (room) {
  if (this.rooms[room]) {
    delete this.rooms[room];
  }
  this.syncFile();
};

module.exports = RoomFile;
