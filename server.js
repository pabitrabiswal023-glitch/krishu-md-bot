const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));
app.get("/health", (req, res) => res.json({ status: "online", bot: "KRISHU-MD" }));

app.listen(PORT, () => console.log("🌐 Web running on port " + PORT));
