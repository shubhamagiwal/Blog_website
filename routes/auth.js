var LocalStrategy = require('passport-local').Strategy;
var user = require("./../model/user");
var users = require("./users");
require("./connect.js").connect();
module.exports = function(app,passport)
{
    passport.use(new LocalStrategy(function(username,password,done)
    {
        user.findOne({user:username},function(err,user)
        {
            if(err)
            {
                return done(err);
            }
            if(!user)
            {
                return done(null,false,{message:'Incorrect username'});
            }
            var check=user.validatePassword(password);
            if(check===true)
            {
                //console.log(req.isAuthenticated);
                return done(user);
            }
            else
            {
               return done(null,false,{message:'Incorrect Password'});
            }
        });
    }));
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
      //retrieve user from database by id
      user.findOne({_id:id},function(err, user) {
        if(err)
        {
            console.log(err);
        }
        done(err, user);
      });
    });
    //This is for logout and logging in the user , so that we can perform various functions later
    app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(user) {
        console.log("authenticating passport")
        console.log(user);
        if (!user) {
          console.log("Error: User does not exist"); 
          return res.redirect('/login'); 
        }
        req.logIn(user, function(err_login) {
          if (err_login) {
            console.log("Error while login: " + err_login); 
            return next(err_login); 
          }
          req.session.messages = "Login successfull";
          req.session.authenticated = true;
          req.authenticated = true;
          if (req.session.returnTo){
            return res.redirect(req.session.returnTo);
          }
          return res.redirect('/');
        });
      })(req, res, next);
    });
    //{successRedirect:"/",failureRedirect:"/login"}));//users.login_check);
    app.get('/login',users.login);
    app.get('/logout',function(req,res,next)
    {
        req.logout();
        req.session.destroy(function(err)
            {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        res.redirect('/index');
                    }
            });
    });
}