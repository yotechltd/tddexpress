require('dotenv').config()
const express = require("express");
const app = express();
require("./db/config");
app.use("/test", require("./route/route"));

module.exports = app;