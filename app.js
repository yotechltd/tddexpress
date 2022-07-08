const express = require("express");
const app = express();
require("./db/config");
app.use("/test", require("./route/route"));

app.listen(4000, (err)=>{
    !err ? console.log("run on port 4000") : console.log(err);
})