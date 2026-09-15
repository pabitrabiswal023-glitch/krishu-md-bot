const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  jidNormalizedUser
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");
const config = require("./config");

const logger = pino({ level: "silent" });
const plugins = [];

// Load all plugins
for (const file of fs.readdirSync("./plugins").filter(f => f.endsWith(".js"))) {
  try {
    plugins.push(require(path.join(__dirname, "plugins", file)));
  } catch (e) {
    console.log("Plugin error:", file, e.message);
  }
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(config.SESSION_DIR);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger,
    printQRInTerminal: false,
    browser: ["Krishu-MD", "Chrome", "1.0.0"],   // gives pairing code on mobile
    getMessage: async () => undefined
  });

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
