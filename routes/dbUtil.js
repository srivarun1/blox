const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'blox',
  password: 'Neelkg@69',
  port: 5432,
})


module.exports = { 
        addUserAccount : function(username, password)
        {

            pool.query('INSERT INTO users ("USERNAME", "PASSWORD") VALUES ($1, MD5($2))', [username, password], (error, results) => {
                if (error) {
                  console.log(error)
                  throw error
                }
                console.log("user added")
              })
        },

        isUsernameAvailable :   function(username)  
        {
         
            return new Promise(resolve => {
              setTimeout(() => {
                let isValid = false;
                pool.query('SELECT COUNT(*) FROM USERS WHERE "USERNAME" = $1', [username], (error, results) => {
                  if (error) {
                    console.log(error);
                    throw error
                  }
      
                  if(parseInt(results.rows[0].count) == 0)
                  {
                    isValid = true;
                  }
                resolve(isValid);
              }, 5000);
            });
          })
        },

        isValidCredential :   function(username,password)  
        {
         
            return new Promise(resolve => {
              setTimeout(() => {
                let isValid = false;
                pool.query('SELECT COUNT(*) FROM users WHERE "username" = $1 AND "password" = MD5($2)', [username,password], (error, results) => {
                  if (error) {
                    throw error
                  }
      
                  if(parseInt(results.rows[0].count) == 1)
                  {
                    isValid = true;
                  }
                resolve(isValid);
              }, 5000);
            });
          })
        },

        savePost :   function(username,post)  
        {
         
            return new Promise(resolve => {
              setTimeout(() => {
                let isValid = false;

                pool.query('INSERT INTO POST("USERNAME", "POST") VALUES ($1, $2)', [username,post], (error, results) => {
                  if (error) {
                    throw error
                  }

              }, 5000);
            });
          })
        },

        addComment :   function(username,postId,comment)  
        {
         
            return new Promise(resolve => {
              setTimeout(() => {
                pool.query('INSERT INTO COMMENT  ("USERNAME", "POSTID","COMMENT") VALUES ($1, $2,$3)', [username,postId,comment], (error, results) => {
                  if (error) {
                    console.log(error);
                    throw error
                  }
      

              }, 5000);
            });
          })
        },

        getPost :   function(postId)  
        {
         
            return new Promise(resolve => {
              setTimeout(() => {
                let isValid = false;
                pool.query('SELECT * FROM POST WHERE "POSTID" = $1', [postId], (error, results) => {
                  if (error) {
                    console.log(error);
                    throw error
                  }
                resolve(results.rows);
              }, 5000);
            });
          })
        },

        getComment :   function(commentId)  
        {
         
            return new Promise(resolve => {
              setTimeout(() => {
                let isValid = false;
                pool.query('SELECT * FROM COMMENT WHERE "POSTID" = $1', [commentId], (error, results) => {
                  if (error) {
                    console.log(error);
                    throw error
                  }
                resolve(results.rows);
              }, 5000);
            });
          })
        },

        getUserPosts :   function(username,postId)  
        {
         
            return new Promise(resolve => {
              setTimeout(() => {
                let isValid = false;
                pool.query('SELECT * FROM POST WHERE "POSTID" > $1 and "USERNAME" = $2 LIMIT 5', [postId,username], (error, results) => {
                  if (error) {
                    console.log(error);
                    throw error
                  }
                resolve(results.rows);
              }, 5000);
            });
          })
        },
        getRecentPosts :   function(postId)  
        {
         
            return new Promise(resolve => {
              setTimeout(() => {
                let isValid = false;
                pool.query('SELECT * FROM POST WHERE "POSTID" > $1 LIMIT 5', [postId], (error, results) => {
                  if (error) {
                    console.log(error);
                    throw error
                  }
                resolve(results.rows);
              }, 5000);
            });
          })
        }
};