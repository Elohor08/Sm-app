
const { connect } = require("mongoose");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const upload = require("express-fileupload");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const routes = require("./routes/routes.js");
const { server, app } = require("./socket.io/socket");

const PORT = process.env.PORT;
const MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/mydatabase";
//const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(upload());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

connect(MONGO_URL)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
      console.log(`MongoDB is connected`);
    });
  })
  .catch((err) => console.log(err, 'server is not running'));

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
