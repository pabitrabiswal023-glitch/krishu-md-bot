const axios = require("axios");

module.exports = async ({ body, reply, sock, m, jid }) => {
  const [cmdRaw, ...rest] = body.trim().split(/\s+/);
  const cmd = cmdRaw.toLowerCase();
  const arg = rest.join(" ");

  if (cmd === ".paste") {
    if (!arg) return reply("Usage: .paste <text>");
    try {
      const { data } = await axios.post("https://hastebin.com/documents", arg, {
        headers: { "Content-Type": "text/plain" }
      });
      reply(`📋 Link: https://hastebin.com/${data.key}`);
    } catch { reply("❌ Failed to create paste."); }
  }

  if (cmd === ".short") {
    if (!arg) return reply("Usage: .short <link>");
    try {
      const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(arg)}`);
      reply(`🔗 Short link: ${data}`);
    } catch { reply("❌ Failed."); }
  }

  if (cmd === ".sticker") {
    const media = m.message.imageMessage || m.message.documentMessage;
    if (!media && !(m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage))
      return reply("📸 Image bhejo caption `.sticker` likh ke, ya image pe reply karo");
    try {
      const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
      const img = quoted ? { url: quoted.url } : media;
      const buff = await (await fetch(img.url)).buffer();
      await sock.sendMessage(jid, { sticker: buff }, { quoted: m });
    } catch (e) { reply("❌ Sticker fail: " + e.message); }
  }
};
