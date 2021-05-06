var express = require('express');
var router = express.Router();
const { response } = require('express');
module.exports = router;
var bodyParser = require('body-parser');
const { use } = require('.');

var app = express()

const db = require('./dbUtil.js')
router.post('/', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if(username != null && password != null)
    {
        checkValidityOfTheUsernameAndAddUser(username,password,res)
    }
  });


  async function checkValidityOfTheUsernameAndAddUser(username,password,res)
  {
        const isValid = await db.isUsernameAvailable(username);
        if(isValid)
        {
            db.addUserAccount(username,password);
            res.send("Account created successfully");   
        }
        else
        {
                res.send("Username taken up");
        }
        return isValid;
  }