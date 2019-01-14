var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var postSchema = new Schema({
    title : {type:String ,required : true},
    info : {type :String, required:true},
    createdById : {type : Schema.Types.ObjectId , ref : 'Usermainschema' , required : true},
    link : { 
        info : { type : String , default : '' },
        url : { type : String , default : '' },
        image : { type : String, default : '' }
    },
    communityId : {type : Schema.Types.ObjectId , ref : 'Communitymainschema' , required : true},
    createdOn :  {type : Date , default : Date.now},
    tags : {type : [String] , default : []},
    image : {type :String , default : ""},
    featured : {type :Boolean , default : false},
    global : {type :Boolean , default : false}
},{ collection:'postmainschema'});

var Post = mongoose.model('Postmainschema',postSchema);

module.exports=Post;