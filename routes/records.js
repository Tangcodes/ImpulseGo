var express = require("express");
var router = express.Router();
var Record = require("../models/record");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Record Index
router.get("/", function(req, res){
	// Get all records from DB
	Record.find({}, function(err, allRecords) {
		if(err) {
			console.log(err);
		} else {
			res.render("records/index", {records: allRecords, page: 'records'});
		}
	});
});

// Record Create
router.post("/", middleware.isLoggedIn, function(req, res){
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	req.body.record.author = author;
	// Create a new record and save to DB
	Record.create(req.body.record, function(err, newlyCreatedRecord) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/records");
		}
	});
});

// Record New
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("records/new");
});

// Record Show
router.get("/:id", function(req, res) {
	Record.findById(req.params.id).populate("comments").exec(function(err, foundRecord){
		if (err || !foundRecord) {
			req.flash("error", "Record Not Found");
			res.redirect("/records");
		} else {
			//console.log(foundRecord);
			res.render("records/show", {record: foundRecord});
		}
	});
});

// Record Edit
router.get("/:id/edit", middleware.checkRecordOwnership, function(req, res) {
	Record.findById(req.params.id, function(err, foundRecord) {
		if (err) {
			req.flash("error", "Record Not Found");
			res.redirect("/records")
		} else {
			res.render("records/edit", {record: foundRecord})
		}
	});
});

// Record Update
router.put("/:id", middleware.checkRecordOwnership, function(req, res) {
	Record.findByIdAndUpdate(req.params.id, req.body.record, function(err, updateRecord) {
		if (err) {
			console.log(err);
			res.redirect("/records");
		} else {
			res.redirect("/records/" + req.params.id);
		}
	});
});

// Record Delete
router.delete("/:id", middleware.checkRecordOwnership, function(req, res) {
	Record.findByIdAndRemove(req.params.id, function(err, recordRemoved) {
		if (err) {
			console.log(err);
		} 
		Comment.deleteMany({_id: { $in: recordRemoved.comments } }, function(err) {
			if (err) {
				console.log(err);
			}
			res.redirect("/records");
		});
	})
});

module.exports = router;