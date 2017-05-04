var express = require('express');
var router = express.Router();
var User = require("./../model/user");//this is where we get all values needed for the user

exports.register = function(req,res,next)
{
	var user = new User(
		{
			user : req.body.username,
			name : req.body.name,
			email: req.body.email
		});
	    //console.log(req.body.password);
	    user.setPassword(req.body.password);
	    user.save(function(err)
	    {
	    	/*var token;
	    	token = user.generateJwt();
	    	res.status(200);
	    	res.json({
	    		"token":token
	    	});*/
	    	if(err)
	    	{
	    		if(err.name==='MongoError' && err.code === 11000)
	    		{
	    			//duplicate username
	    			res,redirect("/sign-up",{message:"User already exist"});
	    		}
	    	}
	    	else
	    	{
	    		res.redirect('/');
	    	}
	    });
};

exports.isAuthenticated = function(req,res,next)
{
	console.log(req.session.authenticated);
	if(req.session.authenticated)
	{
		console.log("*")
		next();
	}
	else
	{
		console.log("**");
		res.redirect('/login');
	}
}

exports.sign_up = function(req,res,next)
{
	res.render('sign',{title:'New User'});
}

exports.login = function(req,res,next)
{
	res.render('login',{title:'Login',login:req.session.authenticated});
}

exports.login_check= function(req,res,next)
{
	var sess= req.session;
	console.log(sess);
	User.findOne({user:req.body.username},function(err,post)
	{
		if(err)
		{
			throw err;
		}
		if(req.body.password===undefined)
		{
			res.redirect('/sign-up',{message:"No password entered"});
		}
	    if(user)
		{
			//req.flash('info',)
			res.redirect('/sign-up',{message:"User already exist!!"});
		}
		return next();
		if(post!=null && post.validatePassword(req.body.password))
		{
			//this is when we have login session ready
			console.log('login success');
			req.session.user_id=post._id;
			req.session.user = post;
			console.log(req.session.cookie.path);
			res.redirect(req.session.cookie.path);
		}
		else
		{
			res.status(300).redirect('/login');
		}
	});
}
//this function is written to see if the user exist in the database of not 