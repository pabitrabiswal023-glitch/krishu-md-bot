const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));
app.get("/pair", (req, res) => res.send("Run the bot on desktop/PC once to get the code, or check logs — code prints in console."));

app.listen(PORT, () => console.log("Web running on port " + PORT));
