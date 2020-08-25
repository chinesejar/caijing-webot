const axios = require("axios").default;
const NewsFile = require("./NewsFile");

var thsTime = Math.round(Date.now() / 1000) - 60;
var clTime = Math.round(Date.now() / 1000) - 60;

async function tonghuashun(rooms) {
  const newsFile = new NewsFile("tonghuashun");
  try {
    const res = await axios.get(
      `https://news.10jqka.com.cn/tapp/news/push/stock/?page=1&tag=&track=website&ctime=${thsTime}`
    );
    const { code, data } = res.data;
    if (code === "200") {
      const { list } = data;
      if (list.length !== 0) {
        const news = {};
        for (const { id, title, short, ctime, rtime, url } of list) {
          thsTime = rtime;
          if (!newsFile.exist(id)) {
            console.log(id, title, ctime);
            news[id] = ctime;
            for (const room of rooms) {
              await room.say(`【${title}】${short}(同花顺财经)`);
            }
          }
        }
        newsFile.sync(news);
      }
      newsFile.clean();
    }
  } catch (err) {
    console.log(err);
  }
}

async function cailian(rooms) {
  const newsFile = new NewsFile("cailian");
  try {
    const res = await axios.get(
      `https://www.cls.cn/nodeapi/updateTelegraphList?app=CailianpressWeb&category=&hasFirstVipArticle=1&lastTime=${clTime}&os=web&rn=20&subscribedColumnIds=&sv=7.2.2&sign=7103c1470a840486b1d3c1e4e7c92735`
    );
    const { error, data } = res.data;
    if (error === 0) {
      const { roll_data, update_num } = data;
      if (update_num !== 0) {
        const news = {};
        for (const { id, content, ctime } of roll_data) {
          if (!newsFile.exist(id)) {
            clTime = ctime;
            news[id] = ctime;
            console.log(id, content, ctime);
            for (const room of rooms) {
              await room.say(`${content}(财联社)`);
            }
          }
        }
        newsFile.sync(news);
      }
      newsFile.clean();
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  cailian,
  tonghuashun,
};
