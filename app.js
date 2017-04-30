var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose =require('mongoose');
var routes = require('./routes/index');
var users = require('./routes/users');
var crypto = require("crypto");
var mail = require('./routes/nodemailer');//this is where we will be putting up all the mail data
var dbURL="mongodb://localhost/blogdb";
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Post = require("./model/model");
var user = require("./model/user");
var session = require('express-session');
var flash = require('connect-flash');
//const RedisStore = require("connect-redis")(session);
app.set('trust proxy',1);
app.use(session({
    secret: "TEST",
    resave:true,
    saveUninitialized: true}));
var sess;
//mongoose connection for the app
mongoose.connect(dbURL,function(err,res,next)
    {
        if(err)
        {
            console.log(err);
        }
        console.log("connected to the database");
    });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(flash());
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
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/js', express.static(__dirname + '/node_modules/jade-bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/jade-bootstrap/dist/css')); 
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.methodOverride());
//app.use(app.router);
app.get('/',routes.index);
app.get('/index',function(req,res,next)
    {
        res.redirect("/");
    });
//this is the new user login page
app.post('/new',routes.new_post);
app.get('/new',users.isAuthenticated,routes.serve_post);
app.post('/register',users.register);
app.get('/sign-up',users.sign_up);


//this is for contact form wherever we need it later
app.post('/contact',mail.contact);
app.get('/contact',function(req,res,next)
{
    res.render('contact',{title:'contact',login:req.session.authenticated});
});


//This is for logout and logging in the user , so that we can perform various functions later
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(user) {
    console.log("authenticating passport")
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

/// catch 404 and forwarding to error handler
app.get('/link/:post_snug',function(req,res,next)
    {
        //res.send(req.params.post_snug);
        Post.findOne({slug:req.params.post_snug},function(err,post)
        {
            if(err)
            {
                console.log(err);
            }
            post.update_hit();
            res.render('blog',{title:"blog",post:post,login:req.session.authenticated});
        });
    });

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
