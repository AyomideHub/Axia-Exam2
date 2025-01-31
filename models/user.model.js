const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = mongoose.Schema({
	
	username: {
		type: String,
		require:[true, 'please provide your username'],
		unique: true,
		trim: true
	},
	email:{
		type: String,
		require:[true, 'please provide your email'],
		unique: true,
		validate:{
			validator: validator.isEmail,
      		message: 'Please provide valid email',
		}
		
	},
	password:{
		type: String,
		require:[true, 'please provide your password'],
		minlength: 8
	},
	
	
}, {timestamps: true})


module.exports = mongoose.model('User', UserSchema)