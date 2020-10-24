const express = require("express");
var mongoose = require("mongoose");
var mkdirp = require("mkdirp");
var bodyParser = require("body-parser");
var session = require("express-session");
var url = require("url");
const express = require("express");
var mongoose = require("mongoose");
var mkdirp = require("mkdirp");
var bodyParser = require("body-parser");
var session = require("express-session");
var url = require("url");

app.get("/", redirectLogin, (req, res) => {
  User.findById(req.session.userInfo._id)
    .select(
      "name image role dob gender email phone city interest journey expectation"
    )
    .exec(function (err, user) {
      if (err) throw err;
      if (req.session.userInfo.firstTimeLogin == true)
        return res.render("firstTimeLogin", { user: user });
      return userRedirection(req, res, req.session.userInfo);
    });
});
app.post("/login", redirectLogin, (req, res) => {
  req.session.userInfo.firstTimeLogin = false;
  User.findById(req.session.userInfo._id)
    .select("firstTimeLogin")
    .exec(function (err, user) {
      if (err) throw err;
      user.firstTimeLogin = false;
      user.name = req.body.fullname;
      user.dob = req.body.dob;
      req.session.userInfo.name = req.body.fullname;
      req.session.userInfo.dob = req.body.dob;

      user.save();
    });
  return userRedirection(req, res, req.session.userInfo);
});
