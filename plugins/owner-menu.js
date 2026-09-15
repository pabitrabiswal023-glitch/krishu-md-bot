const config = require("../config");

module.exports = async ({ sock, m, jid, sender, body, reply }) => {
  const p = config.PREFIX;
  const cmd = body.trim().split(/\s+/)[0].toLowerCase();

  if (cmd === `${p}menu` || cmd === `${p}help`) {
    return reply(
`╭─「 ${config.BOT_NAME} 」
│ 🤖 .menu — this menu
│ 📌 .ping — bot speed
│ 👤 .owner — owner info
│ 📥 .sticker — image→sticker
│ 📷 .photo — sticker→photo
│ 🔊 .tts <text> — text to speech
│ 📋 .paste <text> — make pastebin
│ ⚙️ .runtime — uptime
│ 👥 .promote/.demote @user (admin)
│ 🚪 .kick @user (admin)
│ 🔗 .welcome on/off (group)
│ 🧹 .clear — clear temp (owner)
│ 📴 .shutdown — stop bot (owner)
╰─────────────`
    );
  }

  if (cmd === `${p}ping`) {
    const t = Date.now();
    await reply("📶 Speed test...");
    return reply(`🏓 Pong! ${Date.now() - t} ms`);
  }

  if (cmd === `${p}owner`) {
    return reply(`👑 Owner: wa.me/${config.OWNER_NUMBER}`);
  }

  if (cmd === `${p}runtime`) {
    const up = process.uptime();
    const h = Math.floor(up / 3600), mn = Math.floor(up % 3600 / 60), s = Math.floor(up % 60);
    return reply(`⏱ Runtime: ${h}h ${mn}m ${s}s`);
  }

  if (cmd === `${p}shutdown` && sender.includes(config.OWNER_NUMBER)) {
    await reply("🛑 Shutting down...");
    process.exit(0);
  }
};
