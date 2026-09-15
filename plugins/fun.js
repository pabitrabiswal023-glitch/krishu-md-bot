const axios = require("axios");

module.exports = async ({ body, reply, sock, m, jid }) => {
  const cmd = body.trim().split(/\s+/)[0].toLowerCase();
  const arg = body.trim().split(/\s+/).slice(1).join(" ");

  if (cmd === ".joke") {
    const { data } = await axios.get("https://official-joke-api.appspot.com/random_joke");
    return reply(`😄 ${data.setup}\n\n${data.punchline}`);
  }

  if (cmd === ".quote") {
    const { data } = await axios.get("https://zenquotes.io/api/random");
    return reply(`💬 "${data[0].q}"\n— ${data[0].a}`);
  }

  if (cmd === ".weather") {
    if (!arg) return reply("Usage: .weather <city>");
    const { data } = await axios.get(`https://wttr.in/${encodeURIComponent(arg)}?format=3`);
    return reply("🌤 " + data);
  }

  if (cmd === ".tts") {
    if (!arg) return reply("Usage: .tts hello");
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(arg)}&tl=en&client=tw-ob`;
    await sock.sendMessage(jid, { audio: { url }, mimetype: "audio/mpeg", ptt: true }, { quoted: m });
  }
};
