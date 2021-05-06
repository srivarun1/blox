var express = require('express');
var router = express.Router();
const auth =  require('./auth.js')
const db = require('./dbUtil.js')
const { response } = require('express');
module.exports = router;
var bodyParser = require('body-parser');
const { use } = require('.');
var redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
var iamAccessMap  = redis.createClient();
var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
async function savePost(username, post)
{
    //Save post to db
    await db.savePost(username,post);
}

function getRecentPosts(lastPostId)
{
    //get And Return next 5 posts
    var posts = await db.getRecentPosts(lastPostId);
    return posts;
}

async function addComment(username,postId,comment)
{
    /*
    * Add comment to parent - here parent can be a comment or a post
    */
    await db.addComment(username,postId,comment);

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


async function getPost(postId)
{
  var post = await db.getPost(postId);
  return post;
}
async function getComments(postId)
{
    // get comments for selected post
    var comment = await db.getComment(postId);
    return comment;
}

function getUserPosts(username,postId)
{
    var posts = await db.getUserPosts(username,postId);
    return posts;
}

    router.post('/savePost', function(req, res, next) {
        var uuidForUsername = req.body.uuid;
        var isSaved = false;
        iamAccessMap.getAsync(uuidForUsername).then(function(res) {
            var post = req.body.post;
            if(res != null)
            {
                if(authenticateUUID(uuidForUsername))
                {
                    if(savePost(res,post))
                    {
                        isSaved = true;
                    }
                }
            }
          });
          res.send(isSaved)
    });

    router.post('/getRecentPosts', function(req, res, next) {
        var lastPostId =  req.body.lastPostId;
        getRecentPosts(postId).then(function(posts){
            if(posts != null)
            {
                res.send(posts);
            }
        });  
    });

    router.post('/addComment', function(req, res, next) {
        var uuidForUsername = req.body.uuid;        
        iamAccessMap.getAsync(uuidForUsername).then(function(uname) {
            var postId = req.body.postId;
            var comment = req.body.comment;
            console.log(uname);
            console.log(postId);
            console.log(comment);
            if(uname != null)
            {
                if(authenticateUUID(uuidForUsername))
                {
                    res.send(addComment(uname,postId,comment));
                }
                else{
                    res.send("Session timed out - Re enter username and password")
                }
            }
          });
      
    });

    router.post('/getPost', function(req, res, next) {
        var postId= req.body.postId;
         getPost(postId).then(function(post){
             if(post != null)
             {
                 res.send(post);
             }
         });
    });

    router.post('/getComments', function(req, res, next) {
        var postId= req.body.postId;
         getComments(postId).then(function(comment){
             if(comment != null)
             {
                 res.send(comment);
             }
         });    
    });

    router.post('/getUserPosts/:username', function(req, res, next) {
        var username  = req.params.username;
        var postId =  req.body.postId;
        getUserPosts(username,postId).then(function(posts){
            if(posts != null)
            {
                res.send(posts);
            }
        });    
    });

    










