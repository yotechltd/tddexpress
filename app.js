const app = require("./server");
app.listen(4000, (err)=>{
    !err ? console.log("run on port 4000") : console.log(err);
})


    // "dev": "dotenv ./config/dev.env/ node app.js",
    // "test": "dotenv ./config/test.env/ jest"