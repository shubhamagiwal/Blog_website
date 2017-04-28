var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var commentSchema= Schema({
   _id:ObjectId,
   body:{
   	type:String,
   	require:true
   },
   create_at:{
   	type:Date
   	default:Date.now
   },
   likes:{
   	type:Number,
   	default:0
   }
});
commentSchema.methods.like = function()
{
	this.likes+=1;
}
module.exports = mongoose.exports('Comment',commentSchema);