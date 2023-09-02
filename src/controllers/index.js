require("dotenv").config();
const { Context, Markup } = require("telegraf");
const request = require("../service/server.module");
const { sortByName} = require("../module");
const { whiteList } = require("../common");
class TelegramController {
  async checkConnection(ctx) {
    ctx.reply("pong !");
  }

  async getAllServers(ctx) {
    try {
      ctx.telegram.sendChatAction(ctx.chat.id, "typing");
      const servers = await request.getServers();
      let buttons = [];
      servers.forEach((item) => {
        buttons.push(Markup.button.callback(item.name, `serv ${item.id}`));
      });
      ctx.reply(
        "Please Select Your Server",
        Markup.inlineKeyboard([...buttons])
      );
    } catch (error) {
      ctx.reply(error.message || "error");
    }
  }

  async getServerChannels(ctx, servID) {
    try {
      ctx.telegram.sendChatAction(ctx.chat.id, "typing");
      const channels = await request.getChannelsByServerID(servID);
      channels.sort(sortByName);
      let buttons = [];
      channels.forEach((item, index) => {
        if (!whiteList.includes(item.name.toLowerCase())) return;
        buttons.push([
          { text: item.name, callback_data: `channel ${item.id}` },
        ]);
      });
      ctx.telegram.sendMessage(ctx.chat.id, String(buttons.length));
      ctx.reply("Please Select Channel", {
        reply_markup: {
          inline_keyboard: buttons,
        },
      });
    } catch (error) {
      ctx.reply(error.message || "error");
    }
  }

  async getContent(ctx, id) {
    try {
      ctx.telegram.sendChatAction(ctx.chat.id, "typing");
      const contents = await request.getChannelContentByID(id);
      if (contents?.code === 50001)
        return ctx.telegram.sendMessage(ctx.chat.id, "عدم دسترسی");
      if (contents?.length <= 0)
        return ctx.telegram.sendMessage(ctx.chat.id, "هیچ موردی یافت نشد");
      contents?.forEach((item) => {
        if (!item?.attachments) return;
        item?.attachments?.forEach(async (attachment) => {
            const attachmentURL = attachment?.url
            await setTimeout(() => {
              ctx.telegram.sendMessage(ctx.chat.id, attachmentURL);
            }, 5000);
        });
      });

     

    } catch (error) {
      ctx.reply(error.message || "error");
    }
  }
}

module.exports = new TelegramController();
