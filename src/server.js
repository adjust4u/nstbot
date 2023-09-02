const { Telegraf } = require("telegraf");
const { startMessage } = require("./common");
const {checkConnection, getAllServers, getServerChannels, getContent} = require("./controllers/index");


require("dotenv").config();

class Application {
  #telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  app = new Telegraf(this.#telegramBotToken);
  
  constructor() {
    this.config();
    this.start();
    this.commands();
    this.actions();
  }

  config() {
    this.app.launch();
    
    console.log("Bot online");
    process.once("SIGINT", () => this.app.stop("SIGINT"));
    process.once("SIGTERM", () => this.app.stop("SIGTERM"));
  }

  start() {
    this.app.start((ctx) => {
      ctx.reply(startMessage);
    });
  }

  commands(){
    this.app.command("ping", checkConnection);
    this.app.command("server", getAllServers);
  }
  
  actions(){
    this.app.action(/.*/, (ctx) => {
      const action  = ctx.match[0]
      const param = action.split(" ")[1]
      switch (action.split(" ")[0]) {
        case "serv":
          getServerChannels(ctx, param);
          break;
        case "channel":
          getContent(ctx, param);
          break;
        default:
          ctx.reply("invalid options");
          break;
      }
    })
  }
}

module.exports = new Application();
