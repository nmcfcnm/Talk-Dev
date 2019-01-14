var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    image : {type:String , default:''},
    email : {type :String, required:true},
    phone : {type :Number, required:true},
    journey : {type : String, default: ''},
    interest : {type : [String], default: []},
    expectation : {type : String , default : ''},
    city : {type :String, required:true},
    password : {type :String, required:true},
    role : {type : String, default: 'user'},
    gender: {type : String, default: 'male'},
    name : {type : String, default: ''},
    dob : {type : String, default: ''},
    activated : {type : Boolean, default: true},
    myCreatedCommunities : [{type : Schema.Types.ObjectId , ref : 'Communitymainschema'}],
    superAdmin:{type : Boolean,default:false},
    status : {type: String , default:'pending'},
    adminCommunities : [{type : Schema.Types.ObjectId , ref : 'Communitymainschema'}],
    JoinedCommunties : [{type : Schema.Types.ObjectId , ref : 'Communitymainschema'}],
    RequestedCommunties : [{type : Schema.Types.ObjectId , ref : 'Communitymainschema'}],
    adminAsUser : {type : Boolean , default : false},
    firstTimeLogin : {type : Boolean , default : true },
    invited : [{type : Schema.Types.ObjectId , ref : 'Communitymainschema'}]
},{ collection:'usermainschema'});


var User = mongoose.model('Usermainschema',userSchema);

module.exports=User;