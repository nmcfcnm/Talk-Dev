var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var replySchema = new Schema({
    createdById : {type : Schema.Types.ObjectId , ref : 'Usermainschema' , required : true},
    replyBody : {type:String ,required : true},
    createdOn :  {type : Date , default : Date.now},
    commentId : {type : Schema.Types.ObjectId , ref : 'Commentmainschema' , required : true}
},{ collection:'replymainschema'});

var Reply = mongoose.model('Replymainschema',replySchema);

module.exports=Reply;