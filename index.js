const express= require('express');
const app= express();
const path= require('path');
const mongoose= require('mongoose');
const cookieParser= require('cookie-parser')

mongoose.connect('mongodb://localhost/bhupeshDB')
.then(()=>console.log("Mongodb Connected"))
.catch((err)=>console.log(err))
app.use(express.json())
app.use(cookieParser())


app.use('/api/users',require('./routes/user'));

app.listen(5005,()=>{
    console.log("server started")
})