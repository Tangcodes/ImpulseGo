var express = require("express");
var router = express.Router({mergeParams: true});
var Record = require("../models/record");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Comment New
router.get("/new", middleware.isLoggedIn, function(req, res) {
	Record.findById(req.params.id, function(err, record) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {record: record});
		}
	})
});

// Comment Create
router.post("/", middleware.isLoggedIn, function(req, res) {
	Record.findById(req.params.id, function(err, record) {
		if (err) {
			console.log(err);
			res.redirect("/records");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					// Add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// Save comment
					comment.save();
					record.comments.push(comment);
					record.save();
					req.flash("success", "Successfully added comment");
					res.redirect("/records/" + record._id);
				}
			});
		}
	});
});

// Comment Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Record.findById(req.params.id, function(err, foundRecord) {
		if (err || !foundRecord) {
			req.flash("error", "Record Not Found");
			return res.redirect("back");
		}
	})
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			res.redirect("back")
		} else {
			res.render("comments/edit", {record_id: req.params.id, comment: foundComment});
		}
	})
});

// Comment Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/records/" + req.params.id);
		}
	})
});

// Comment Delete
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comments deleted");
			res.redirect("/records/" + req.params.id);
		}
	});
});

module.exports = router;