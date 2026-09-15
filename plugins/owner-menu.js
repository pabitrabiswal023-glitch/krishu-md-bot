module.exports = async ({ body, reply, isOwner, config, sock, jid }) => {
  const p = config.PREFIX;
  const cmd = body.trim().split(/\s+/)[0].toLowerCase();

  if (cmd === `${p}menu` || cmd === `${p}help`) {
    return reply(
`╭─「 ${config.BOT_NAME} 」
│ 🤖 .menu — ye menu
│ 📌 .ping — speed test
│ ⏱ .runtime — uptime
│ 👑 .owner — owner info
│ 📥 .sticker — image→sticker
│ 🔊 .tts <text> — text to speech
│ 🌤 .weather <city> — mausam
│ 😄 .joke — random joke
│ 💬 .quote — random quote
│ 📊 .info — bot info
│ 👥 .promote/.demote @user
│ 🚪 .kick @user
│ 🔇 .mute / .unmute (group)
│ 📴 .shutdown — bot band (owner)
╰─────────────`);
  }

  if (cmd === `${p}ping`) {
    const t = Date.now();
    await reply("📶 Testing...");
    return reply(`🏓 Pong! ${Date.now() - t} ms`);
  }

  if (cmd === `${p}owner`)
    return reply(`👑 Owner: ${config.OWNER_NAME}\n📱 wa.me/${config.OWNER_NUMBER}`);

  if (cmd === `${p}runtime`) {
    const up = (Date.now() - global.botStartTime) / 1000;
    return reply(`⏱ Uptime: ${Math.floor(up/3600)}h ${Math.floor(up%3600/60)}m ${Math.floor(up%60)}s`);
  }

  if (cmd === `${p}info`)
    return reply(`🤖 ${config.BOT_NAME} v1.0\n📡 Baileys MD\n🌏 Works: All Countries\n⭐ Repo: github.com/pabitrabiswal023-glitch/krishu-md-bot`);

  if (cmd === `${p}shutdown` && isOwner) {
    await reply("🛑 Bot shutting down...");
    process.exit(0);
  }
};
