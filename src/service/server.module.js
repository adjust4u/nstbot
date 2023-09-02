const axios = require("axios");
class Request {
  app = axios.create({
    baseURL: "https://discord.com/api/v9",
    headers: {
      'Authorization': process.env.DISCORD_ACCOUNT_TOKEN,
    },
  });

  async getServers() {
    try {
      const result = await this.app.get("/users/@me/guilds");
      return result.data;
    } catch (error) {
      return {status:error.response.status, message:error.response.data};
    }
  }
  async getServerByID(id) {
    try {
      const result = await this.app.get(`/guilds/${id}`);
      return result.data;
    } catch (error) {
      return {status:error.response.status, message:error.response.data};
    }
  }
  async getChannelsByServerID(servID) {
    try {
      const result = await this.app.get(`/guilds/${servID}/channels`);
      return result.data;
    } catch (error) {
      return {status:error.response.status, message:error.response.data};
    }
  }
  async getChannelContentByID(id) {
    try {
      const result = await this.app.get(`channels/${id}/messages?limit=100`);
      return result.data;
    } catch (error) {
      return {status:error.response.status, message:error.response.data};
    }
  }
}

module.exports = new Request();
