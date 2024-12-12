const express = require('express');

const userRouter=require('./routes/user.routes')
const dotenv=require('dotenv');
dotenv.config();

const connectToDB=require("./config/db")
connectToDB();
const cookieParser=require('cookie-parser');

const app = express();
const indexRouter=require('./routes/index.routes');

app.set('view engine','ejs');
app.use(cookieParser());
app.use(express.json());       // middleware taaki jo input hai wo 
app.use(express.urlencoded({extended:true}))  //terminal mein "undefined na dikhe aur poora data dikhe"
app.use('/',indexRouter)
app.use('/user',userRouter)






app.listen(3000, () => {
    console.log("Server running on port 3000");
});



