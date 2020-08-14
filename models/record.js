const mongoose = require("mongoose");

var recordSchema = new mongoose.Schema({
	content: String,
	amount: Number,
	isImpulse: Boolean,
	createdDate: {type: Date, default: Date.now},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Record", recordSchema);