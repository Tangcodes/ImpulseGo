var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root route
router.get("/", function(req, res){
	res.render("landing");
});

// Show register form
router.get("/register", function(req, res) {
	res.render("register", {page: 'register'});
});

// Handle sign up logic
router.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	if (req.body.adminCode === "token1008") {
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			res.render("register", {"error": err.message});
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Welcome to ImpulseGo " + user.username);
			res.redirect("/records");
		});
	});
})

// Show login form
router.get("/login", function(req, res) {
	res.render("login", {page: 'login'});
});

// Handle login logic
router.post("/login", passport.authenticate("local", 
	{successRedirect: "/records", 
	 failureRedirect: "/login"
	}), function(req, res) {
});

// Handle Logout logic
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "See you later!");
	res.redirect("/records");
})

module.exports = router;