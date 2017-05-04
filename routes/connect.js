exports.connect = function()
{
	var dbURL="mongodb://localhost/blogdb";
    var mongoose =require('mongoose');
	mongoose.connect(dbURL,function(err,res,next)
    {
        if(err)
        {
            console.log(err);
        }
        console.log("connected to the database");
    });
}