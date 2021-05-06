var express = require('express');
var router = express.Router();
const rateLimiter = require("redis").createClient();
const iamAccessMap = require("redis").createClient();
const db = require('./dbUtil.js')
rateLimiter.on("error", function (err) {
  console.log("Error " + err);
});

iamAccessMap.on("error", function (err) {
  console.log("Error " + err);
});

rateLimiter.on('connect',() => {
  console.log("rateLimiter active");
})
iamAccessMap.on('connect',() => {
  console.log("iamAccessMap active");
})

const {v4 : uuidv4} = require('uuid');
const { response } = require('express');
module.exports = router;
var bodyParser = require('body-parser');
const { use } = require('.');

var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

async function authenticateUser(username,password)
{
  const isValidCred = await db.isValidCredential(username,password);
  return isValidCred;
}

function insertAccessKeyInCache(username, uuid)
{
  //Insert key in cache and return whether it was put in successfully
  console.log('Entering username and UUID ' + username + ' ' + uuid);
   iamAccessMap.set(uuid,username);
   iamAccessMap.get(uuid, (err, data)=>{
    if(err){
      throw err;
    }
    
  });
   iamAccessMap.expire(uuid,24*60*60*60);
   return true;
}

function authenticateUUID(uuid)
{
  //Authenticate and get username for uuid
  if(iamAccessMap.get(uuid, (err, redisRes) => {
    if(err)
    {
      return false;
    }
  }));
   return true;
}


function getUsernameFromId(uuid)
{
  return iamAccessMap.get(uuid);
}

function isWithinRateLimit(uuid)
{
  //check if the number of request within past 30 seconds is not greater than 5
  if(rateLimiter.get(uuid, (err, redisRes) => {
    let count = 0;
    if(redisRes)
    {
      if(redisRes > 5)
      {
        return false;
      }
      else
      {
        count = redisRes;
      }
    }
    rateLimiter.set(uuid,count+1);
    rateLimiter.expire(uuid,60);
  }));
  return true;
}

router.post('/', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var uuidForUsername = req.body.uuid;
    console.log('Request parameters - ' + username + ' ' + password);
    if(uuidForUsername != null)
    {
      if(authenticateUUID(uuidForUsername))
      {
          res.send("success");
      }
      else{
        res.send("Session timed out - Re enter username and password")
      }
    }
    else{
      console.log("there");
      if(authenticateUser(username,password))
      {
        var newId = uuidv4()
        if(insertAccessKeyInCache(username,newId))
        {
          res.send(newId);
        }
      }
      else
      {
        res.send("Invalid username or password") 
      }
    }
  });

