//var express = require('express');
//var router = express.Router();
var Post = require("./../model/model");

exports.index=function(req, res) {
  Post.find(function(err,posts)
  {
  	if(err)
  	{
  		console.log(err);
  	}
  	console.log(req.session.authenticated);
  	res.render('index', { title: 'Blog' ,posts:posts});	
  });
};
exports.serve_post=function(req,res)
{
	if(!req.session.authenticated)
	{
		res.redirect('/login');
	}
	else
	{
		res.render('view',{title:'Add new'});
	}
}
exports.new_post = function(req,res)
{
		console.log(req.body.post_title);
		var post = new Post({
			title:req.body.post_title,
			body:req.body.post_body,
			slug:req.body.post_slug
		});

		post.save(function(err)
		{
			if(err)
			{
				console.log(err);
			}
			else
				res.redirect('/');
		});
};
exports.link=function(req,res)
{
	console.log(req.params.post_link);
}
