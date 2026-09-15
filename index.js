const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");
const config = require("./config");

const logger = pino({ level: "silent" });
const plugins = [];

// Auto-load all plugins
for (const file of fs.readdirSync("./plugins").filter(f => f.endsWith(".js"))) {
  try {
    plugins.push(require(path.join(__dirname, "plugins", file)));
    console.log("✅ Plugin loaded:", file);
  } catch (e) {
    console.log("❌ Plugin error:", file, e.message);
  }
}

const startTime = Date.now();
global.botStartTime = startTime;

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(config.SESSION_DIR);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger,
    printQRInTerminal: false,
    browser: ["Krishu-MD", "Chrome", "1.0.0"],
    getMessage: async () => undefined
  });

  if (!sock.authState.creds.registered && config.PAIRING_MODE) {
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(config.OWNER_NUMBER + "@s.whatsapp.net");
        console.log("\n╔══════════════════════════╗");
        console.log("🔗 PAIRING CODE:", code?.match(/.{1,4}/g)?.join("-"));
        console.log("╚══════════════════════════╝");
        console.log("WhatsApp → Linked Devices → Link with phone number\n");
      } catch (e) { console.log("Pair error:", e.message); }
    }, 3000);
  }

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") console.log("✅ KRISHU-MD is ONLINE!");
    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) {
        console.log("🔄 Reconnecting...");
        startBot();
      } else {
        console.log("❌ Logged out. Delete session/ folder & re-pair.");
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const jid = m.key.remoteJid;
    const isGroup = jid.endsWith("@g.us");
    const sender = isGroup ? m.key.participant : jid;
    const body =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      m.message.imageMessage?.caption || "";
    if (!body) return;

    for (const plugin of plugins) {
      if (typeof plugin !== "function") continue;
      try {
        await plugin({
          sock, m, jid, sender, body, isGroup,
          config,
          isOwner: sender.includes(config.OWNER_NUMBER),
          reply: (t) => sock.sendMessage(jid, { text: t }, { quoted: m }),
          react: (e) => sock.sendMessage(jid, { react: { text: e, key: m.key } })
        });
      } catch (e) {
        console.log("Command error:", e.message);
      }
    }
  });

  return sock;
}

startBot();  });

  if (!sock.authState.creds.registered && config.PAIRING_MODE) {
    setTimeout(async () => {
      const code = await sock.requestPairingCode(config.OWNER_NUMBER + "@s.whatsapp.net");
      console.log("\n🔗 PAIRING CODE:", code?.match(/.{1,4}/g)?.join("-") || code);
      console.log("Open WhatsApp → Linked Devices → Link a Device → Link with phone number\n");
    }, 3000);
  }

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") console.log("✅ KRISHU-MD is online!");
    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason !== DisconnectReason.loggedOut) startBot();
      else console.log("❌ Logged out. Delete session folder and re-pair.");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    const m = messages[0];
    if (!m.message) return;

    const jid = m.key.remoteJid;
    const isGroup = jid.endsWith("@g.us");
    const sender = isGroup ? m.key.participant : jid;
    const body =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      m.message.imageMessage?.caption || "";

    if (!body) return;

    for (const plugin of plugins) {
      if (typeof plugin !== "function") continue;
      try {
        await plugin({
          sock, m, jid, sender, body, isGroup,
          reply: (t) => sock.sendMessage(jid, { text: t }, { quoted: m })
        });
      } catch (e) {
        console.log("Command error:", e.message);
      }
    }
  });

  return sock;
}

startBot();
