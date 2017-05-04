var nodemailer = require("nodemailer");
/*We have created transport for our mail to go to the user*/
var transport = nodemailer.createTransport({
	service:"gmail",
	host:"mail.google.com",
	auth:{
		user:"",
		pass:""
	}
});
exports.contact = function(req,res)
{
	console.log("Mail sending has to be written")
}