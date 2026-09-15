const axios = require("axios");

module.exports = async ({ body, reply, sock, m, jid }) => {
  const cmd = body.trim().split(/\s+/)[0].toLowerCase();
  const arg = body.trim().split(/\s+/).slice(1).join(" ");

  if (cmd === ".yt") {
    if (!arg) return reply("Usage: .yt <youtube link>");
    try {
      const { data } = await axios.get(`https://api.akuari.my.id/downloader/youtube?url=${encodeURIComponent(arg)}`);
      await reply("⏬ Downloading audio...");
      await sock.sendMessage(jid, { audio: { url: data.result.mp3 }, mimetype: "audio/mpeg" }, { quoted: m });
    } catch { reply("❌ Download failed, try another link."); }
  }

  if (cmd === ".tiktok") {
    if (!arg) return reply("Usage: .tiktok <link>");
    try {
      const { data } = await axios.get(`https://api.akuari.my.id/downloader/tiktok?url=${encodeURIComponent(arg)}`);
      await sock.sendMessage(jid, { video: { url: data.result.nowm }, caption: "⬇️ TikTok • KRISHU-MD" }, { quoted: m });
    } catch { reply("❌ Download failed."); }
  }

  if (cmd === ".ig") {
    if (!arg) return reply("Usage: .ig <instagram link>");
    try {
      const { data } = await axios.get(`https://api.akuari.my.id/downloader/igdl?url=${encodeURIComponent(arg)}`);
      await sock.sendMessage(jid, { video: { url: data.result[0].url }, caption: "⬇️ Instagram • KRISHU-MD" }, { quoted: m });
    } catch { reply("❌ Download failed."); }
  }
};
