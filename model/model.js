var mongoose = require("mongoose");

var Schema = mongoose.Schema;
//mongoose schema

var postSchema = Schema({
	title:{
		type:String,
		required:true
	},
	body:{
		type:String,
		required:true
	},
	slug:{
		type:String,
		required:true,
		uniqure:true
	},
	create_at:{
		type:Date,
		default:Date.now
	},
	hit_val:{
		type:Number,
		default:0
	},
});
postSchema.methods.update_hit=function()
{
		this.hit_val=this.hit_val+1;
}
module.exports = mongoose.model('Post',postSchema);
