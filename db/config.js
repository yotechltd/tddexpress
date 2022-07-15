const mongoose = require("mongoose");
const url = process.env.NODE_ENV == "test" ? process.env.TEST_URL : process.env.MONGO_URL;
mongoose.connect(url, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
    ignoreUndefined: true 
},(error)=>{
    if(error){
      console.log(error);
    }else{
      console.log(`Connected to bigdata database`);
    }
  })

// async() => {
//   await mongoose.connect(url, {    useNewUrlParser: true,
//         // useCreateIndex: true,
//         // useFindAndModify: false,
//         useUnifiedTopology: true,
//         ignoreUndefined: true})
// }