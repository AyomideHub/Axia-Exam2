const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

const register = async (req, res) => {
	const {email, username, password} = req.body

	if (!email || !username || !password ){
		return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg: "provide correct details"})
	}

	let user = await User.findOne({email})

	if(user){	
		return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg: "email already in use"})
	}

	const hashpassword = await bcrypt.hash(password, 10)

	user = await User.create({email, username, password : hashpassword,})

	res.status(StatusCodes.CREATED).json({success: true, msg: "registration sucessfull", data: {...user._doc, password: undefined}})

}

const login = async (req, res) => {
	const {email, password} = req.body
	if (!email || !password){
		return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg: "invalid credentials"})
	}
	const user = await User.findOne({email})
	if (!user){
		return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg: "invalid credentials"})
	}
	const verifyPassword = await bcrypt.compare(password, user.password)

	if(verifyPassword){
		const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET, {
			expiresIn: "7d"
		})

		res.cookie("token", token, {
			httpOnly: true,
			secure: false, // for dev mode
			sameSite:"strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
			saveUnititialized: true,
			resave: false 
		})
	} else {
		return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg: "invalid credentials"})
	}

	res.status(StatusCodes.OK).json({success: true, msg: "login sucessfully", data: {...user._doc, password: undefined}})
}

const logout = async (req, res) => {
	res.clearCookie("token")
	res.status(StatusCodes.OK).json({success: true, msg: "logout successfull"})
}


module.exports = {register, login, logout}