
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var communitySchema = new Schema({
    image : {type:String , default:''},
    name : {type :String},
    info : {type :String,default: ""},
    communityType: {type : String , default : 'public' },
    membersJoined : [ { type : Schema.Types.ObjectId , ref : 'Usermainschema' } ],
    admin : [{type : Schema.Types.ObjectId , ref : 'Usermainschema'}],
    owner : {type : Schema.Types.ObjectId , ref : 'Usermainschema'},
    invited : [{type : Schema.Types.ObjectId , ref : 'Usermainschema'}],
    membersRequested : [{type : Schema.Types.ObjectId , ref : 'Usermainschema'}],
    createdOn : {type : Date, default: Date.now}
},{ collection:'communitymainschema'});


var Community = mongoose.model('Communitymainschema',communitySchema);

module.exports=Community;