const express = require("express");



const app = express();

app.get("/", (req, res)=>{
    res.sendFile(__dirname+'/login.html');
});

app.listen(3002, (req,res)=>{
    console.log("server started on port 3002");
});