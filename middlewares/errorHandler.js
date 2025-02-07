const { CustomError } = require("./customError")

const errorHandlerMiddleware = (err, req, res, next) => {
	if (err instanceof CustomError){
		return res.status(err.statuscode).json({error_Msg: err.message})
	}
	res.status(500).json('something went wrong')
}

module.exports = errorHandlerMiddleware
