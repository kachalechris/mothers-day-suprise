
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const websiteFolder = path.join(
  __dirname,
  "mothers-day-suprise"
);

app.use(express.static(websiteFolder));

app.get("/", (req, res) => {
  res.sendFile(path.join(websiteFolder, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Website running on port ${PORT}`);
});
