var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = new Schema({
    createdById : {type : Schema.Types.ObjectId , ref : 'Usermainschema' , required : true},
    commentBody : {type:String ,required : true},
    createdOn :  {type : Date , default : Date.now},
    postId : {type : Schema.Types.ObjectId , ref : 'Postmainschema' , required : true}
},{ collection:'commentmainschema'});

var Comment = mongoose.model('Commentmainschema',commentSchema);

module.exports=Comment;