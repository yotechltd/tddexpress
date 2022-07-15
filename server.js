require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("./db/config");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/test", require("./route/route"));

module.exports = app;