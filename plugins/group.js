module.exports = async ({ sock, m, jid, body, isGroup, isOwner, reply, config }) => {
  if (!isGroup) return;
  const [cmd, ...rest] = body.trim().split(/\s+/);
  const target = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

  const isAdminCmd = [".kick", ".promote", ".demote"].includes(cmd);

  if (isAdminCmd) {
    if (!target) return reply(`Usage: ${cmd} @user (reply ya tag karo)`);
    const action = {
      ".kick": "remove",
      ".promote": "promote",
      ".demote": "demote"
    }[cmd];
    try {
      await sock.groupParticipantsUpdate(jid, [target], action);
      reply(`✅ Done! ${action} successful.`);
    } catch { reply("❌ Bot ko admin banao pehle!"); }
  }

  if (cmd === ".mute") {
    await sock.groupSettingUpdate(jid, "announcement");
    reply("🔇 Group muted — sirf admin message kar sakta hai.");
  }
  if (cmd === ".unmute") {
    await sock.groupSettingUpdate(jid, "not_announcement");
    reply("🔊 Group unmuted — sab message kar sakte hain.");
  }
  if (cmd === ".welcome" && isOwner) {
    const on = rest[0] === "on";
    config.WELCOME = on;
    reply(`👋 Welcome messages: ${on ? "ON" : "OFF"}`);
  }
};
