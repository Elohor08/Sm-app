const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Server is working!");
});

app.listen(4000, () => {
  console.log("Test server is running on port 5000");
});
