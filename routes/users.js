var express = require('express');
var router = express.Router();
var User = require("./../model/user");//this is where we get all values needed for the user

exports.register = function(req,res)
{
	var user = new User(
		{
			user : req.body.user,
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
	    			return res.status(500).send({success:false,message:"User already exist"});
	    		}
	    	}
	    	sess.email=req.body.email;
	    	res.redirect('/index');
	    	/*
	    	res.json({
	    		sucess:true
	    	});*/
	    });
};

exports.sign_up = function(req,res)
{
	res.render('sign',{title:'New User'});
}

exports.login = function(req,res)
{
	res.render('login',{title:'Login'});
}

exports.login_check= function(req,res,callback)
{
	/*if(req.sess.email)
	{
		res.redirect('/index');
	}*/
	User.findOne({user:req.body.username},function(err,post)
	{
		if(err)
		{
			throw err;
		}
		console.log(req.body.username);
		if(req.body.password===undefined)
		{
			res.status(300).redirect('/login');
		}
		if(post!=null && post.validatePassword(req.body.password))
		{
			//this is when we have login session ready
			console.log('login success');
			//res.sess.email=post.email;
			req.session.authenticated = true;
			res.redirect('/index');
		}
		else
		{
			res.status(300).redirect('/login');
		}
	});
}