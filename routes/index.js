//var express = require('express');
//var router = express.Router();
var Post = require("./../model/model");
var User = require("./../model/user");
exports.index=function(req, res) {
  Post.find(function(err,posts)
  {
  	if(err)
  	{
  		console.log(err);
  	}
  	res.render('index', { title: 'Blog' ,posts:posts,login:req.session.authenticated});	
  });
};
exports.serve_post=function(req,res,next)
{
	res.render('view',{title:'Add new',login:req.session.authenticated});
}
exports.new_post = function(req,res,next)
{
	var post = new Post({
		title:req.body.post_title,
		body:req.body.post_body,
		slug:req.body.post_slug,
		postedBy:req.session.id
	});

		post.save(function(err)
		{
			if(err)
			{
				console.log(err);
			}
			else
			{
				res.redirect('/');
			}
		});
};
exports.link=function(req,res,next)
{
	console.log(req.params.post_link);
}
