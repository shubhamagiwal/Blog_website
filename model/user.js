var mongoose=require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;
//var jwt= require('jsonwebtoken');
var userSchema = Schema(
{
	user:{
		type:String,
		required:true,
		unique:true
	},
	email:{
		type:String,
		required:true,
		unique:true
	},
	hash:String,
	salt:String,
	LastLogin:{
		type:Date,
		default:Date.now
	},
	create_on:{
		type:Date,
		default:Date.now
	}
});
userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'SHA1').toString('hex');
}

userSchema.methods.validatePassword = function(password){
    var hash=crypto.pbkdf2Sync(password, this.salt, 1000, 64,'SHA1').toString('hex');
    return this.hash === hash;
};

//userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',userSchema);