const express = require("express");
var mongoose = require("mongoose");
var mkdirp = require("mkdirp");
var bodyParser = require("body-parser");
var session = require("express-session");
var url = require("url");

const app = express();
const port = 3000;

mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost:27017/TalkDev", { useNewUrlParser: true })
  .then(() => console.log("You are now Connected to Mongo DB"))
  .catch((err) => conseole.err("Something Went Wrong", err));
app.locals.loginFailed = 0;

var User = require("./models/usermodel");
var Community = require("./models/communitymodel");
var Post = require("./models/postmodel");
var Comment = require("./models/commentsmodel");
var Reply = require("./models/replymodel");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    name: "sid",
    resave: false,
    saveUninitialized: false,
    secret: "sab badhiya hai",
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
      sameSite: true,
      secure: false,
    },
  })
);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use((req, res, next) => {
  res.locals.isAuthFailed = false;
  next();
});

const redirectLogin = (req, res, next) => {
  if (req.session.userId) return next();
  req.session.redirectPath = url.parse(req.url).pathname;
  req.session.redirectPathExist = true;
  return res.redirect("/");
};
userRedirection = (req, res, user) => {
  if (user.role == "admin" && user.adminAsUser == false)
    return res.redirect("/Admin/Profile");
  return res.redirect("/community/communitypanel");
};
function checkUser(req, res, user) {
  if (user.firstTimeLogin == true) return res.redirect("/login");
  if (req.session.redirectPathExist)
    return res.redirect(req.session.redirectPath);
  return userRedirection(req, res, user);
}
const redirectHome = (req, res, next) => {
  if (!req.session.userId) return next();
  checkUser(req, res, req.session.userInfo);
};

app.get("/", redirectHome, (req, res) => {
  res.render("login");
});
app.post("/", redirectHome, (req, res) => {
  User.findOne({ email: req.body.email })
    .select(
      "name image role activated adminAsUser firstTimeLogin email password"
    )
    .exec(function (err, user) {
      if (err) throw err;
      if (user === null || user.password !== req.body.password) {
        res.locals.isAuthFailed = true;
        return res.render("login");
      }
      if (user.activated == false)
        return res.render("userDeactivatedAccountAccess");
      const { userId } = req.session;
      req.session.userId = user._id;
      req.session.userInfo = user;
      checkUser(req, res, user);
    });
});

app.get("/admin/adduser", redirectLogin, (req, res) => {
  res.render("admin/addUser", { user: req.session.userInfo });
});
app.post("/admin/adduser", redirectLogin, (req, res) => {
  newUser = new User({
    email: req.body.email,
    phone: req.body.phone,
    city: req.body.city,
    password: req.body.password,
    role: req.body.role,
  });
  newUser.save(function (err) {
    if (err) throw err;
    mkdirp("public/user_images/" + newUser._id, function (err) {
      return err;
    });
    res.render("admin/addUser", { user: req.session.userInfo });
  });
});
app.post("/check", function (req, res) {
  User.findOne({ email: req.body.email })
    .select("email")
    .exec(function (err, user) {
      if (err) throw err;
      if (user == null) return res.send(JSON.stringify({ value: false }));
      return res.send(JSON.stringify({ value: true }));
    });
});

app.get("/Admin/Profile", redirectLogin, (req, res) => {
  if (req.session.userInfo.role == "user") return res.render("Error");
  var pathname = url.parse(req.url).pathname;
  User.findById(req.session.userInfo._id)
    .select(
      "name city role adminAsUser gender email phone dob city interest journey expectation"
    )
    .exec(function (err, user) {
      if (err) throw err;
      res.render("profile", { user: user, path: pathname });
    });
});
app.get("/profile", redirectLogin, (req, res) => {
  var pathname = url.parse(req.url).pathname;
  User.findById(req.session.userInfo._id)
    .select(
      "name city role adminAsUser gender email phone dob city interest journey expectation"
    )
    .exec(function (err, user) {
      if (err) throw err;
      res.render("profile", { user: user, path: pathname });
    });
});

app.get("/editProfile", redirectLogin, (req, res) => {
  User.findById(req.session.userInfo._id)
    .select(
      "name image role dob gender email phone city interest journey expectation"
    )
    .exec(function (err, user) {
      if (err) throw err;
      res.render("editProfile", { user: user });
    });
});
app.post("/editProfile", redirectLogin, (req, res) => {
  var _id = req.session.userInfo._id,
    name = req.body.name,
    dob = req.body.dob,
    gender = req.body.gender,
    phone = req.body.phone,
    city = req.body.city,
    expectation = req.body.expectation,
    journey = req.body.journey;
  User.updateOne(
    { _id: _id },
    {
      name: name,
      dob: dob,
      gender: gender,
      phone: phone,
      city: city,
      expectation: expectation,
      journey: journey,
    },
    function (err, user) {
      if (err) throw err;
      req.session.userInfo.name = name;
      req.session.userInfo.image = image;
      return res.redirect("/editProfile");
    }
  );
});

app.get("/admin/userlist", redirectLogin, (req, res) => {
  res.render("admin/userList", { user: req.session.userInfo });
});
app.post("/entries", redirectLogin, (req, res) => {
  User.find()
    .select("email phone city status role")
    .exec(function (err, users) {
      res.send(JSON.stringify(users));
    });
});

app.get("/community/communityList", redirectLogin, (req, res) => {
  res.render("admin/communityListing", { user: req.session.userInfo });
});
app.post("/commentries", redirectLogin, (req, res) => {
  Community.find()
    .select("name communityType owner createdOn image info")
    .exec(function (err, comm) {
      res.send(JSON.stringify(comm));
    });
});

app.get("/changePassword", redirectLogin, (req, res) => {
  res.render("changePassword", { user: req.session.userInfo });
});
app.post("/changePassword", redirectLogin, (req, res) => {
  if (!req.body.oldPassword == req.session.userInfo.password)
    alert("old password doesnt match");
  req.session.userInfo.password = req.body.password;
  User.updateOne(
    { _id: req.session.userInfo._id },
    { password: req.body.newPassword },
    function (err, user) {
      if (err) throw err;
      return res.redirect("/changePassword");
    }
  );
});

app.get("/logout", redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) return err;
    res.redirect("/");
  });
});

app.get("/community/AddCommunity", redirectLogin, (req, res) => {
  res.render("user/createCommunity", { user: req.session.userInfo });
});
app.post("/community/AddCommunity", redirectLogin, (req, res) => {
  comm = new Community({
    name: req.body.communityName,
    info: req.body.communityDesc,
    communityType: req.body.communityMembershipRule,
    image: req.body.communityImage,
    owner: req.session.userInfo._id,
  });
  comm.save(function (err) {
    if (err) throw err;
    User.updateOne(
      { _id: req.session.userInfo._id },
      { $push: { myCreatedCommunities: comm._id } },
      function (err) {
        if (err) throw err;
      }
    );
    res.render("user/createCommunity", { user: req.session.userInfo });
  });
});

app.get("/community/communitypanel", redirectLogin, function (req, res) {
  User.findById(req.session.userInfo._id)
    .populate("myCreatedCommunities", "_id name image membersRequested")
    .populate("adminCommunities", "_id name image membersJoined admin")
    .populate("JoinedCommunties", "_id name image membersJoined admin")
    .populate("RequestedCommunties", "_id name image membersJoined admin")
    .populate("invited", "_id name image membersJoined admin")
    .select(
      "myCreatedCommunities adminCommunities JoinedCommunties RequestedCommunties invited"
    )
    .lean()
    .exec(function (err, result) {
      if (err) throw err;
      return res.render("community/communitypanel", {
        user: req.session.userInfo,
        commPopulated: result,
      });
    });
});
app.post("/rejectInvite", redirectLogin, (req, res) => {
  var userid = req.session.userInfo._id;
  var commid = req.body.commid;
  User.updateOne(
    { _id: userid },
    {
      $pull: { invited: commid },
    },
    function (err) {
      if (err) throw err;
      Community.updateOne(
        { _id: commid },
        {
          $pull: { invited: userid },
        },
        function (err) {
          if (err) throw err;
          return res.end();
        }
      );
    }
  );
});
app.post("/acceptInvite", redirectLogin, (req, res) => {
  var userid = req.session.userInfo._id;
  var commid = req.body.commid;

  User.updateOne(
    { _id: userid },
    {
      $pull: { invited: commid },
      $push: { JoinedCommunties: commid },
    },
    function (err) {
      if (err) throw err;

      Community.updateOne(
        { _id: commid },
        {
          $pull: { invited: userid },
          $push: { membersJoined: userid },
        },
        function (err) {
          if (err) throw err;
          return res.end();
        }
      );
    }
  );
});
app.post("/cancelJoinRequest", redirectLogin, (req, res) => {
  var userid = req.session.userInfo._id;
  var commid = req.body.commid;
  User.updateOne(
    { _id: userid },
    {
      $pull: { RequestedCommunties: commid },
    },
    function (err) {
      if (err) throw err;
      Community.updateOne(
        { _id: commid },
        {
          $pull: { membersRequested: userid },
        },
        function (err) {
          if (err) throw err;
          return res.end();
        }
      );
    }
  );
});

app.get("/community/list", redirectLogin, (req, res) => {
  Community.find({
    $and: [
      { membersJoined: { $nin: [req.session.userInfo._id] } },
      { owner: { $nin: [req.session.userInfo._id] } },
      { admin: { $nin: [req.session.userInfo._id] } },
      { invited: { $nin: [req.session.userInfo._id] } },
      { membersRequested: { $nin: [req.session.userInfo._id] } },
    ],
  })
    .select("_id name communityType info name image")
    .exec(function (err, comm) {
      res.render("community/list", { user: req.session.userInfo, c: comm });
    });
});
app.post("/joinCommunityRequest", redirectLogin, (req, res) => {
  var userid = req.session.userInfo._id,
    commid = req.body.id;
  Community.findOne({ _id: commid })
    .select("communityType")
    .exec(function (err, comm) {
      if (err) throw err;
      if (comm.communityType == "public") {
        Community.updateOne(
          { _id: commid },
          {
            $push: { membersJoined: userid },
          },
          function (err) {
            if (err) throw err;
            User.updateOne(
              { _id: userid },
              {
                $push: { JoinedCommunties: commid },
              },
              function (err) {
                if (err) throw err;
                return res.send(JSON.stringify({ type: "public" }));
              }
            );
          }
        );
      } else if (comm.communityType == "private") {
        Community.updateOne(
          { _id: commid },
          {
            $push: { membersRequested: userid },
          },
          function (err) {
            if (err) throw err;
            User.updateOne(
              { _id: userid },
              {
                $push: { RequestedCommunties: commid },
              },
              function (err) {
                if (err) throw err;
                return res.send(JSON.stringify({ type: "private" }));
              }
            );
          }
        );
      }
    });
});
function checkType(arr, id) {
  var flag = false;
  arr.forEach(function (user) {
    if (user._id == id) {
      flag = true;
    }
  });
  return flag;
}
app.get("/community/communityprofile/:_id", redirectLogin, (req, res) => {
  var id = req.session.userInfo._id;
  Community.findOne({ _id: req.params._id })
    .populate("membersJoined", "_id name image")
    .populate("admin", "_id name image")
    .populate("membersRequested", "_id name image")
    .populate("RequestedCommunties", "_id name image")
    .populate("owner", "_id name image")
    .lean()
    .exec(function (err, comm) {
      if (err) throw err;
      var communityInteraction = "notJoinedNorRequested";
      if (comm.owner._id == id) {
        communityInteraction = "owner";
      }

      if (checkType(comm.membersJoined, id)) {
        communityInteraction = "joined";
      }
      if (checkType(comm.admin, id)) {
        communityInteraction = "admin";
      }
      if (checkType(comm.invited, id)) {
        communityInteraction = "invited";
      }
      if (checkType(comm.membersRequested, id)) {
        communityInteraction = "requested";
      }
      res.render("community/communityProfile", {
        comm: comm,
        user: req.session.userInfo,
        communityInteraction: communityInteraction,
      });
    });
});
app.post("/leaveJoinedCommunity", redirectLogin, (req, res) => {
  var userid = req.session.userInfo._id;
  var commid = req.body.commid;
  User.updateOne(
    { _id: userid },
    {
      $pull: { JoinedCommunties: commid },
    },
    function (err) {
      if (err) throw err;
      Community.updateOne(
        { _id: commid },
        {
          $pull: { membersJoined: userid },
        },
        function (err) {
          if (err) throw err;
          return res.end();
        }
      );
    }
  );
});

app.get("/community/discussion/:_id", redirectLogin, (req, res) => {
  Community.findOne({ _id: req.params._id })
    .select("name _id image")
    .exec(function (err, community) {
      if (err) throw err;
      res.render("community/communityPosts", {
        user: req.session.userInfo,
        comm: community,
      });
    });
});

app.get("/community/editcommunity/:_id", redirectLogin, (req, res) => {
  Community.findOne({ _id: req.params._id })
    .select("name _id communityType info image")
    .exec(function (err, community) {
      if (err) throw err;
      res.render("community/EditCommunity", {
        user: req.session.userInfo,
        comm: community,
      });
    });
});
app.post("/community/editcommunity/:_id", redirectLogin, (req, res) => {
  var _id = req.params._id,
    name = req.body.name,
    communityType = req.body.communityType,
    info = req.body.communityDescription,
    image = req.body.image;
  Community.updateOne(
    { _id: _id },
    { name: name, communityType: communityType, info: info, image: image },
    function (err, user) {
      if (err) throw err;
      return res.redirect("/community/editcommunity/" + _id);
    }
  );
});

app.get("/community/managecommunity/:_id", redirectLogin, (req, res) => {
  Community.findOne({ _id: req.params._id })
    .select("name _id image membersJoined membersRequested invited admin")
    .exec(function (err, community) {
      if (err) throw err;
      res.render("community/managecommunity", {
        user: req.session.userInfo,
        comm: community,
      });
    });
});
// .populate('RequestedCommunties', '_id name image').populate('owner', '_id name image')
app.post("/community/allcomusers/:_id", redirectLogin, (req, res) => {
  Community.findOne({ _id: req.params._id })
    .populate("membersJoined", "_id name image")
    .lean()
    .exec(function (err, comm) {
      if (err) throw err;
      return res.send(JSON.stringify({ comm: comm }));
    });
});
app.post("/community/allcomadminsandowners/:_id", redirectLogin, (req, res) => {
  Community.findOne({ _id: req.params._id })
    .populate("admin", "_id name image")
    .populate("owner", "_id name image")
    .select("owner admin")
    .lean()
    .exec(function (err, comm) {
      if (err) throw err;
      return res.send(JSON.stringify({ admin: comm.admin, owner: comm.owner }));
    });
});
app.post("/community/membersRequested/:_id", redirectLogin, (req, res) => {
  Community.findOne({ _id: req.params._id })
    .populate("membersRequested", "_id name image")
    .select("membersRequested")
    .lean()
    .exec(function (err, comm) {
      if (err) throw err;
      return res.send(
        JSON.stringify({ membersRequested: comm.membersRequested })
      );
    });
});
app.post("/community/invited/:_id", redirectLogin, (req, res) => {
  Community.findOne({ _id: req.params._id })
    .populate("invited", "_id name image")
    .select("invited")
    .lean()
    .exec(function (err, comm) {
      if (err) throw err;
      return res.send(JSON.stringify({ invited: comm.invited }));
    });
});
app.get("/community/invite/:_id", redirectLogin, (req, res) => {
  Community.findOne({ _id: req.params._id })
    .select("name _id image")
    .exec(function (err, community) {
      if (err) throw err;
      res.render("community/InviteUsers", {
        user: req.session.userInfo,
        comm: community,
      });
    });
});
app.post("/community/invite/:_id", redirectLogin, (req, res) => {
  var userid = req.session.userInfo._id,
    commid = req.params._id;

  var search;
  if (req.body.find) {
    var regex = new RegExp(("^" + req.body.find).toLowerCase(), "i");
    search = { email: regex };
  } else {
    search = {};
  }
  var query = {
    $and: [
      search,
      { JoinedCommunties: { $nin: [commid] } },
      { myCreatedCommunities: { $nin: [commid] } },
      { admin: { $nin: [commid] } },
      { invited: { $nin: [commid] } },
      { RequestedCommunties: { $nin: [commid] } },
    ],
  };
  User.find(query)
    .select("_id name image")
    .lean()
    .exec(function (err, result) {
      if (err) throw err;
      return res.send(JSON.stringify(result));
    });
});
app.post("/community/inviteUser/:_id", redirectLogin, (req, res) => {
  var commid = req.params._id,
    userid = req.body.userid;
  Community.updateOne(
    { _id: commid },
    {
      $push: { invited: userid },
    },
    function (err) {
      if (err) throw err;
      User.updateOne(
        { _id: userid },
        {
          $push: { invited: commid },
        },
        function (err) {
          if (err) throw err;
          return res.send(JSON.stringify());
        }
      );
    }
  );
});
app.post("/cancelTheInvite", redirectLogin, (req, res) => {
  var userid = req.body.userid;
  var commid = req.body.commid;
  User.updateOne(
    { _id: userid },
    {
      $pull: { invited: commid },
    },
    function (err) {
      if (err) throw err;
      Community.updateOne(
        { _id: commid },
        {
          $pull: { invited: userid },
        },
        function (err) {
          if (err) throw err;
          return res.end();
        }
      );
    }
  );
});
app.post("/AcceptJoinRequest", redirectLogin, (req, res) => {
  var userid = req.body.userid;
  var commid = req.body.commid;
  User.updateOne(
    { _id: userid },
    {
      $pull: { RequestedCommunties: commid },
      $push: { JoinedCommunties: commid },
    },
    function (err) {
      if (err) throw err;

      Community.updateOne(
        { _id: commid },
        {
          $pull: { membersRequested: userid },
          $push: { membersJoined: userid },
        },
        function (err) {
          if (err) throw err;
          return res.end();
        }
      );
    }
  );
});
app.post("/makeAdmin", redirectLogin, (req, res) => {
  var userid = req.body.userid;
  var commid = req.body.commid;
  User.updateOne(
    { _id: userid },
    {
      $pull: { JoinedCommunties: commid },
      $push: { adminCommunities: commid },
    },
    function (err) {
      if (err) throw err;
      Community.updateOne(
        { _id: commid },
        {
          $pull: { membersJoined: userid },
          $push: { admin: userid },
        },
        function (err) {
          if (err) throw err;
          return res.end();
        }
      );
    }
  );
});
app.post("/deleteCommunityUserfromJoined", redirectLogin, (req, res) => {
  var userid = req.body.userid;
  var commid = req.body.commid;
  console.log("user id : " + userid + "  commid  : " + commid);
  User.updateOne(
    { _id: userid },
    {
      $pull: { JoinedCommunties: commid },
    },
    function (err) {
      if (err) throw err;
      Community.updateOne(
        { _id: commid },
        {
          $pull: { membersJoined: userid },
        },
        function (err) {
          if (err) throw err;
          return res.end();
        }
      );
    }
  );
});
app.post("/deleteCommunityUserfromAdmin", redirectLogin, (req, res) => {
  var userid = req.body.userid;
  var commid = req.body.commid;
  User.updateOne(
    { _id: userid },
    {
      $pull: { adminCommunities: commid },
    },
    function (err) {
      if (err) throw err;
      Community.updateOne(
        { _id: commid },
        {
          $pull: { admin: userid },
        },
        function (err) {
          if (err) throw err;
          return res.end();
        }
      );
    }
  );
});
app.post("/removeAdmin", redirectLogin, (req, res) => {
  var userid = req.body.userid;
  var commid = req.body.commid;
  User.updateOne(
    { _id: userid },
    {
      $pull: { adminCommunities: commid },
      $push: { JoinedCommunties: commid },
    },
    function (err) {
      if (err) throw err;
      Community.updateOne(
        { _id: commid },
        {
          $pull: { admin: userid },
          $push: { membersJoined: userid },
        },
        function (err) {
          if (err) throw err;
          return res.end();
        }
      );
    }
  );
});
app.post("/RejectJoinRequest", redirectLogin, (req, res) => {
  var userid = req.body.userid;
  var commid = req.body.commid;
  User.updateOne(
    { _id: userid },
    {
      $pull: { RequestedCommunties: commid },
    },
    function (err) {
      if (err) throw err;
      Community.updateOne(
        { _id: commid },
        {
          $pull: { membersRequested: userid },
        },
        function (err) {
          if (err) throw err;
          return res.end();
        }
      );
    }
  );
});

app.get("/community/communitymembers/:_id", redirectLogin, (req, res) => {
  Community.findOne({ _id: req.params._id })
    .select("name _id image")
    .exec(function (err, community) {
      if (err) throw err;
      res.render("community/communitymembers", {
        user: req.session.userInfo,
        comm: community,
      });
    });
});

app.post("/listPost/:_id", (req, res) => {
  Post.find({ communityId: req.body.commid })
    .populate("createdById", "name")
    .lean()
    .exec(function (err, post) {
      if (err) throw err;
      res.send(JSON.stringify(post));
    });
});
app.post("/createPost/:_id", redirectLogin, (req, res) => {
  post = new Post({
    title: req.body.title,
    info: req.body.details,
    createdById: req.session.userInfo._id,
    communityId: req.params._id,
  });
  post.save(function (err) {
    if (err) throw err;
    Comment.count({ postId: post._id }, function (err, c) {
      res.send(
        JSON.stringify({
          post: post,
          createdById: req.session.userInfo._id,
          createdByName: req.session.userInfo.name,
          commentsCount: c,
        })
      );
    });
  });
});
app.post("/deleteThePost", redirectLogin, (req, res) => {
  Post.findOneAndRemove({ _id: req.body.postid }, function (err) {
    if (err) throw err;
    return res.send();
  });
});
app.post("/GlobalThePost", redirectLogin, (req, res) => {
  Post.findOne({ _id: req.body.postid }, function (err, post) {
    if (post.global == true) post.global = false;
    else post.global = true;
    post.save(function (err) {
      if (err) throw err;
      return res.send(
        JSON.stringify({ _id: req.body.postid, global: post.global })
      );
    });
  });
});
app.post("/featureThePost", redirectLogin, (req, res) => {
  Post.findOne({ _id: req.body.postid }, function (err, post) {
    if (post.featured == true) post.featured = false;
    else post.featured = true;
    post.save(function (err) {
      if (err) throw err;
      return res.send(
        JSON.stringify({ _id: req.body.postid, featured: post.featured })
      );
    });
  });
});
app.post("/listGlobalPostsOnly", (req, res) => {
  Post.find({ $and: [{ communityId: req.body.commid }, { global: true }] })
    .populate("createdById", "name")
    .lean()
    .exec(function (err, post) {
      if (err) throw err;
      res.send(JSON.stringify(post));
    });
});

app.post("/showCommenting", redirectLogin, (req, res) => {
  Comment.find({ postId: req.body.postid })
    .populate("createdById", "name image")
    .lean()
    .exec(function (err, comment) {
      res.send(
        JSON.stringify({ comment: comment, image: req.session.userInfo.image })
      );
    });
});

app.post("/postANewComment", redirectLogin, (req, res) => {
  var postid = req.body.postid,
    commentBody = req.body.commentBody;
  comment = new Comment({
    commentBody: commentBody,
    postId: postid,
    createdById: req.session.userInfo._id,
  });
  comment.save(function (err) {
    if (err) throw err;
    return res.send(
      JSON.stringify({
        comment: comment,
        name: req.session.userInfo.name,
        image: req.session.userInfo.image,
        userid: req.session.userInfo._id,
      })
    );
  });
});
app.post("/deleteTheComment", redirectLogin, (req, res) => {
  var commentid = req.body.commentid;
  Comment.deleteOne({ _id: commentid }, function (err) {
    if (err) throw err;
    return res.end();
  });
});

app.post("/postANewReply", redirectLogin, (req, res) => {
  var comment = req.body.commentid,
    reply = req.body.replyBody;
  reply = new Reply({
    replyBody: reply,
    commentId: comment,
    createdById: req.session.userInfo._id,
  });
  reply.save(function (err) {
    if (err) throw err;
    return res.send(
      JSON.stringify({
        reply: reply,
        name: req.session.userInfo.name,
        image: req.session.userInfo.image,
        userid: req.session.userInfo._id,
      })
    );
  });
});
app.post("/showReplying", redirectLogin, (req, res) => {
  Reply.find({ commentId: req.body.commentid })
    .populate("createdById", "name image")
    .lean()
    .exec(function (err, reply) {
      res.send(JSON.stringify({ reply: reply }));
    });
});
app.post("/deleteTheReply", redirectLogin, (req, res) => {
  var replyid = req.body.replyid;
  Reply.deleteOne({ _id: replyid }, function (err) {
    if (err) throw err;
    return res.end();
  });
});

app.get("/[A-Za-z0-9]*", redirectLogin, (req, res) => {
  res.render("Error", {
    user: req.session.userInfo,
  });
});
app.listen(port, () => {
  console.log("Server Started at " + port);
});
