const fs = require("fs");
const path = require("path");

function NewsFile(name) {
  this.news = {};
  this.file = path.join(__dirname, `${name}.json`);
  if (fs.existsSync(this.file)) {
    this.news = JSON.parse(fs.readFileSync(this.file));
  }
}

NewsFile.prototype.syncFile = function () {
  fs.writeFileSync(this.file, JSON.stringify(this.news));
};

NewsFile.prototype.clean = function () {
  const lastMinute = Math.round(Date.now() / 1000) - 60;
  Object.entries(this.news).forEach(([key, value]) => {
    if (value < lastMinute) {
      delete this.news[key];
    }
  });
  this.syncFile();
};

NewsFile.prototype.exist = function (id) {
  return !!this.news[id];
};

NewsFile.prototype.sync = function (news) {
  this.news = Object.assign(this.news, news);
  this.syncFile();
};

module.exports = NewsFile;
