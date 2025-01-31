const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, 'Please provide post title'],
		unique: true,
		maxlength: [100, 'title can not be more than 100 characters'],
	  },
	  
	content: {
		type: String,
		required: [true, 'Please provide the post content'],
	  },
	
	  tag: {
		type: String,
		trim: true,
		required: [true, 'Please provide post category'],
	  },

	  createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	  }
	},
	{ timestamps: true}
)

module.exports = mongoose.model('Post', postSchema)