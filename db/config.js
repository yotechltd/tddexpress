const mongoose = require("mongoose");
// console.log(process.env.MONGO_URL)
// console.log(process.env);
const url = process.env.NODE_ENV == "test" ? process.env.TEST_URL : process.env.MONGO_URL;
console.log(url);
// mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     // useCreateIndex: true,
//     // useFindAndModify: false,
//     useUnifiedTopology: true,
//     ignoreUndefined: true 
// },(error)=>{
//     if(error){
//       console.log(error);
//     }else{
//       console.log(`Connected to bigdata database`);
//     }
//   })