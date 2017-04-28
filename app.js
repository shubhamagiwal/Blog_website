var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose =require('mongoose');
var routes = require('./routes/index');
var users = require('./routes/users');
var mail = require('./routes/nodemailer');//this is where we will be putting up all the mail data
var dbURL="mongodb://localhost/blogdb";
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Post = require("./model/model")
var session = require('express-session');
app.set('trust proxy',1);
app.use(session({secret: 'ssshhhhh',
cookie:{maxAge:60000}}));
var sess;
//mongoose connection for the app
mongoose.connect(dbURL,function(err,res)
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
/*passport.use(new LocalStrategy(function(username,password,done)
{
    findByUsername(username,function(err,user)
    {
        if(err)
        {
            return done(err);
        }
        if(!user)
        {
            return done(null,false,{message:"Unknown USer"});
        }

    });
    if(false)
    {
        return done(null,false,{message:"Invalid Password"});
    }
}));
app.use(passport.initialize());
app.use(passport.session());*/
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
app.get('/',function(req,res)
{
    var sess=req.session;
    console.log(sess);
    res.redirect('/index');
});

app.get('/index',routes.index);
//this is the new user login page
app.post('/new',routes.new_post);
app.get('/new',routes.serve_post);
//app.use('/user',routes.users);
app.post('/register',users.register);
app.get('/sign-up',users.sign_up);


//this is for contact form wherever we need it later
app.post('/contact',mail.contact);
app.get('/contact',function(req,res)
{
    res.render('contact',{title:'contact'});
});


//This is for logout and logging in the user , so that we can perform various functions later
app.post('/login',users.login_check);
app.get('/login',users.login);
app.get('/logout',function(req,res)
{
    delete req.session.authenticated;
    res.redirect('/index');
});

/// catch 404 and forwarding to error handler
app.get('/link/:post_snug',function(req,res)
    {
        //res.send(req.params.post_snug);
        Post.findOne({slug:req.params.post_snug},function(err,post)
        {
            if(err)
            {
                console.log(err);
            }
            post.update_hit();
            res.render('blog',{title:"blog",post:post});
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
