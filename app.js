const app = require("./server");
app.listen(4000, (err)=>{
    !err ? console.log("run on port 4000") : console.log(err);
})
