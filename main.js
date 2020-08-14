var express = require("express");
var bodyParser = require("body-parser");
var app = express();
const mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var User = require("./models/user");

// Requiring routes
var recordRoutes  = require("./routes/records"),
    commentRoutes = require("./routes/comments"),
	indexRoutes    = require("./routes/index")

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

// MongoDB
mongoose.connect("mongodb://localhost:27017/impulse_go", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// Passport Configuration
app.use(require("express-session")({
	secret: "Try to be a new money manager",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/records", recordRoutes);
app.use("/records/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(3000, process.env.IP, function(){
	console.log("The ImpulseGo Server Has Started!");
});