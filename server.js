const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {dbConnect} = require("./utils/dbConnect");

const app = express();

const PORT = process.env.PORT;
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", require("./routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("Hello");
});

dbConnect();

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
