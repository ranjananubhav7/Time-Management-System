const express = require("express");
const bodyParser = require("body-parser");
const mongo = require("mongodb").MongoClient;

const app = express();
var dburl = "mongodb://localhost:27017/";


app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req,res)=>{
    res.sendFile(__dirname+'/demo.html');
});

function uploadDocument(longUrl){
  var data = longUrl.split('`');
  
  mongo.connect(dburl, function(err,db){
    if(err) throw err;
    var dbo = db.db("test");
    var myobj = { meetid: data[0], userid: data[1], room:data[2], sTime:data[3], eTime:data[4] };
    dbo.collection("urlShortener").insertOne(myobj, function(err, res1) {
    if (err) throw err;
    db.close();
  });
});
}

function deleteDocument(meetid){
  mongo.connect(dburl, function(err,db){
    if(err) throw err;
    var dbo = db.db("test");
    var myobj = { meetid: meetid };
    dbo.collection("urlShortener").deleteOne(myobj, function(err, res1) {
    if (err) throw err;
    db.close();
  });
});
}

app.get("/upload/:longUrl", (req,res)=>{
  const url = req.params.longUrl;
  uploadDocument(url);
});

app.get("/registeruser/:longUrl", (req, res)=>{
  var longUrl = req.params.longUrl;
  var data = longUrl.split('`');
  
  mongo.connect(dburl, function(err,db){
    if(err) throw err;
    var dbo = db.db("test");
    var myobj = { userid: data[0], userName: data[1], userPass:data[2], department:data[3] };
    dbo.collection("users").insertOne(myobj, function(err, res1) {
    if (err) throw err;
    db.close();
  });
});
});

app.get("/delete/:meetid", (req,res)=>{
  const meetid = req.params.meetid;
  deleteDocument(meetid);
  console.log("document deleted");
});

app.get("/query/:query", (req,res)=>{
  const query = req.params.query;
  if(query == 'getlist'){
    mongo.connect(dburl, function(err, db) {
      if (err) throw err;
      var dbo = db.db("test");
      dbo.collection("urlShortener").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.status(200).json(result);
        db.close();
      });
    });
  }
  else if(query == 'getUserList'){
    mongo.connect(dburl, function(err, db) {
      if (err) throw err;
      var dbo = db.db("test");
      dbo.collection("users").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.status(200).json(result);
        db.close();
      });
    });
  }
  else{
  mongo.connect(dburl, function(err, db) {
    if (err) throw err;
    var dbo = db.db("test");
    console.log(query[7]);
    dbo.collection("urlShortener").find({userid: query.substring(7, )}).toArray(function(err, result) {
      if (err) throw err;
      res.status(200).json(result);
      db.close();
    });
  });
}
});


app.listen(3001, function(){
    console.log('server started on port 3001');
});